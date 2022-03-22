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
    this.searchSubscribtion = this.teamService.getTeamByLoginId(this.activeEvent?.id, this.searchId).subscribe(teams => {
      this.compLoading = false
      if (teams.length == 0) {
        this.messageService.add({message: 'Ei löytynyt tiimiä ⚠️🆘⚠️', status: Status.Error})
        this.teamToEdit = undefined
      }
      else {
        this.teamToEdit = teams[0]
        if (this.teamToEdit.fuksiStatus == undefined)
          this.showFuksiStatus()
      }
      this.searchSubscribtion?.unsubscribe()
    })
  }

  async saveBarScore(barScoreObject: {score: number, comment: string, index?: number}) {
    if (barScoreObject.index != undefined) {
      if (this.teamToEdit?.bars[barScoreObject.index] && this.activeEvent && this.activeEvent.id) {
        this.teamToEdit.bars[barScoreObject.index].score = barScoreObject.score
        this.teamToEdit.bars[barScoreObject.index].scoreComment = barScoreObject.comment
        let overallScore = 0
        this.teamToEdit.bars.forEach(bar => {
          if (bar.score > 120)
            overallScore += 120
          else
            overallScore += bar.score
        })
        if (this.teamToEdit.bonusBar != undefined) {
          if (this.teamToEdit.bonusBar.score > 120)
            overallScore += 120
          else
            overallScore += this.teamToEdit.bonusBar.score
        }
        this.teamToEdit.totalScore = overallScore
        await this.teamService.updateTeam(this.activeEvent?.id, this.teamToEdit)
        this.messageService.add({message: 'Pisteet lisätty 💯', status: Status.Success})
        this.scoreDataService.addScoreData(
          {
            adminEmail: this.email,
            barName: this.teamToEdit?.bars[barScoreObject.index].name,
            score: barScoreObject.score,
            scoreComment: barScoreObject.comment,
            time: new Date()
          }, this.activeEvent?.id)
      }
    }
    else {
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