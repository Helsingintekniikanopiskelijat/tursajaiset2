import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Bar} from 'src/app/models/bar.model';
import {Status} from 'src/app/models/site-message.model';
import {Team} from 'src/app/models/team.model';
import {TursasEvent} from 'src/app/models/tursas-event.model';
import {BarService} from 'src/app/services/admin-services/bar.service';
import {EventService} from 'src/app/services/admin-services/event.service';
import {MessagesService} from 'src/app/services/admin-services/messages.service';
import {ScoreDataService} from 'src/app/services/admin-services/score-data.service';
import {AuthService} from 'src/app/services/auth.service';
import {TeamService} from 'src/app/services/team.service';

@Component({
  selector: 'app-rasti-admin',
  templateUrl: './rasti-admin.component.html',
  styleUrls: ['./rasti-admin.component.css']
})
export class RastiAdminComponent implements OnInit {

  loaded: boolean = false
  user?: null
  email = ''
  allowedToEdit?: boolean
  searchId?: number
  compLoading = false
  activeEvent?: TursasEvent
  teamToEdit?: Team
  barToEdit?: Bar
  barIndex?: number
  searchSubscribtion?: Subscription
  adminEmailInsideBarsArray = false
  constructor(
    public auth: AuthService,
    private messageService: MessagesService,
    private teamService: TeamService,
    private eventService: EventService,
    private barService: BarService,
    private scoreDataService: ScoreDataService
  ) {
  }

  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      this.user = user
      this.email = user.email
      this.loaded = true
    })

    const eventSubscription = this.eventService.getActiveTursasEvent().subscribe(events => {
      if (events != undefined) {
        eventSubscription.unsubscribe()
        this.activeEvent = events[0]
      }
    })
  }

  clearSearchField() {
    this.searchId = undefined
    this.teamToEdit = undefined
  }

  searchTeam() {
    if (this.activeEvent == undefined || this.activeEvent.id == undefined || this.searchId == undefined) {
      this.messageService.add({message: 'Aseta tiimin tunnus!', status: Status.Error})
      return
    }
    this.compLoading = true
    this.teamToEdit = undefined
    this.searchSubscribtion = this.teamService.getTeamByLoginId(this.activeEvent?.id, this.searchId).subscribe(async teams => {
      this.compLoading = false
      if (teams.length == 0) {
        this.messageService.add({message: 'Ei löytynyt tiimiä ⚠️🆘⚠️', status: Status.Error})
        this.teamToEdit = undefined
      }
      else {
        this.teamToEdit = teams[0]
        this.adminEmailInsideBarsArray = false
        if (this.teamToEdit.numberOfBarsInRegion != undefined && this.teamToEdit.numberOfBarsInRegion != this.teamToEdit.bars.length) {
          // Validate team and event existence
          if (!this.teamToEdit || !this.activeEvent?.id) {
            this.messageService.add({message: 'Invalid team or event data', status: Status.Error});
            return;
          }
          this.teamToEdit.bars = this.teamToEdit.bars.slice(0, this.teamToEdit.numberOfBarsInRegion);
          //update bars
          await this.teamService.updateTeam(this.activeEvent?.id, this.teamToEdit)
        }
        this.teamToEdit.bars.forEach(bar => {
          if (bar.adminEmail == this.email) {
            this.adminEmailInsideBarsArray = true
          }
        })
        if (this.teamToEdit.fuksiStatus == undefined)
          this.showFuksiStatus()
      }
      this.searchSubscribtion?.unsubscribe()
    })
  }

  async saveBarScore(barScoreObject: {score: number, comment: string, index?: number}) {
    // Validate team and event existence
    if (!this.teamToEdit || !this.activeEvent?.id) {
      this.messageService.add({message: 'Invalid team or event data', status: Status.Error});
      return;
    }

    // Validate bars array
    if (!Array.isArray(this.teamToEdit.bars)) {
      this.messageService.add({message: 'Invalid bars data', status: Status.Error});
      return;
    }

    // Check for duplicate bars
    const uniqueBars = new Set(this.teamToEdit.bars.map(bar => bar.name));
    if (uniqueBars.size !== this.teamToEdit.bars.length) {
      this.messageService.add({message: 'Duplicate bars detected', status: Status.Error});
      return;
    }

    let targetIndex = barScoreObject.index;

    // Double check: if index is undefined but we have a barToEdit, find the index
    if (targetIndex === undefined && this.barToEdit) {
      targetIndex = this.teamToEdit.bars.findIndex(b => b.name === this.barToEdit?.name);
    }

    if (targetIndex !== undefined && targetIndex !== -1) {
      // Validate index
      if (targetIndex < 0 || targetIndex >= this.teamToEdit.bars.length) {
        this.messageService.add({message: 'Invalid bar index', status: Status.Error});
        return;
      }

      try {
        // Create a copy of the team data
        const updatedTeam = {...this.teamToEdit};
        updatedTeam.bars = [...this.teamToEdit.bars];

        // Update the specific bar
        updatedTeam.bars[targetIndex] = {
          ...updatedTeam.bars[targetIndex],
          score: barScoreObject.score,
          scoreComment: barScoreObject.comment
        };

        // Calculate total score
        const overallScore = this.calculateTotalScore(updatedTeam);
        updatedTeam.totalScore = overallScore;

        // Save to database
        await this.teamService.updateTeam(this.activeEvent.id, updatedTeam);

        // Update local state
        this.teamToEdit = updatedTeam;

        this.messageService.add({message: 'Pisteet lisätty 💯', status: Status.Success});

        // Add score data
        await this.scoreDataService.addScoreData({
          adminEmail: this.email,
          barName: updatedTeam.bars[targetIndex].name,
          score: barScoreObject.score,
          scoreComment: barScoreObject.comment,
          time: new Date(),
          teamId: updatedTeam.id,
          teamName: updatedTeam.name || ''
        }, this.activeEvent.id);
      } catch (error) {
        this.messageService.add({message: 'Error saving score', status: Status.Error});
        console.error('Error saving score:', error);
      }
    } else {
      this.barService.getActiveTursasEvent(this.email).subscribe(async bars => {
        if (bars.length > 0 && this.teamToEdit && this.activeEvent != undefined && this.activeEvent.id) {
          this.teamToEdit.bonusBar = bars[0]
          this.teamToEdit.bonusBar.score = barScoreObject.score
          this.teamToEdit.bonusBar.scoreComment = barScoreObject.comment
          let overallScore = 0
          this.teamToEdit.bars.forEach(bar => {
            if (bar.score > 120)
              overallScore += 120
            else
              overallScore += bar.score
          })
          if (this.teamToEdit.bonusBar != undefined) {
            if (this.teamToEdit.bonusBar.score > 100)
              overallScore += 100
            else
              overallScore += this.teamToEdit.bonusBar.score
          }
          this.teamToEdit.totalScore = overallScore
          await this.teamService.updateTeam(this.activeEvent?.id, this.teamToEdit)
          this.messageService.add({message: 'Pisteet lisätty 💯', status: Status.Success})
        }
        else {
          this.messageService.add({message: 'Bonus baari pisteiden lisääminen epäonnistui ⚠️🆘⚠️', status: Status.Error})
        }
      })
    }
  }

  // Helper method to calculate total score
  private calculateTotalScore(team: Team): number {
    let overallScore = 0;

    // Calculate regular bars score
    team.bars.forEach(bar => {
      overallScore += Math.min(bar.score, 120);
    });

    // Add bonus bar score if exists
    if (team.bonusBar) {
      overallScore += Math.min(team.bonusBar.score, 100);
    }

    return overallScore;
  }

  showFuksiStatus() {
    document.querySelector("#fuksi-status")?.classList.remove('overlay-hidden')
    let overlay = document.querySelector("#hide-fuksi-status") as any
    overlay.style.display = "initial"
  }

  showAddPoints(bar?: Bar, index?: number) {
    this.barToEdit = bar
    this.barIndex = index
    document.querySelector("#add-points")?.classList.remove('overlay-hidden')
    let overlay = document.querySelector("#hide-add-points") as any
    overlay.style.display = "initial"
  }
}