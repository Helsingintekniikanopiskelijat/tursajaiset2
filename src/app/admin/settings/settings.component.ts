import {Component, OnInit} from '@angular/core';
import {AdminLog} from 'src/app/models/admin-log.model';
import {Region} from 'src/app/models/region.model';
import {Team} from 'src/app/models/team.model';
import {AdminLogService} from 'src/app/services/admin-services/admin-log.service';
import {EventService} from 'src/app/services/admin-services/event.service';
import {MessagesService} from 'src/app/services/admin-services/messages.service';
import {RegionService} from 'src/app/services/admin-services/region.service';
import {AuthService} from 'src/app/services/auth.service';
import {TeamService} from 'src/app/services/team.service';
import {Status} from 'src/app/models/site-message.model';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['../admin-styles-2.css', '../admin-styles.css', './settings.component.css']
})
export class SettingsComponent implements OnInit {

  teams?: Team[]
  allTeams?: Team[]
  regions?: Region[]
  selectedRegion: string = ''
  searchTerm: string = ''
  noActiveEvent = false
  
  teamToEdit?: Team
  originalTeam?: Team
  editModalOpen = false
  activeEventId?: string
  currentUser: any

  constructor(private teamService: TeamService, private messageService: MessagesService, private eventService: EventService, private regionService: RegionService, private adminLogService: AdminLogService, private authService: AuthService) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => this.currentUser = user)
    this.regionService.getRegions().subscribe(regions => this.regions = regions)

    this.eventService.getActiveTursasEvent().subscribe((events) => {
      if (events.length > 0) {
        this.activeEventId = events[0].id
        this.teamService.getBestFuksiTeamShortedByScore(events[0].id!).subscribe((teams) => {
          this.allTeams = teams.map(team => {
            team.bars.forEach(bar => {
              if (bar.revealed) {
                bar.score -= 20;
              }
            });
            // Update totalScore for each team
            team.totalScore = team.bars.reduce((total, bar) => total + bar.score, 0);
            team.totalScore += team.bonusBar?.score ? team.bonusBar?.score : 0;
            return team;
          });

          // Sort teams by totalScore in descending order
          this.allTeams.sort((a, b) => b.totalScore - a.totalScore);
          
          this.applyFilter()

          this.allTeams.forEach(team => {
            if(team.bars.length > 5)
            {
              console.log(team)
            }
          })
        });
      } else {
        this.noActiveEvent = true;
      }
    });

  }

  applyFilter() {
    if (!this.allTeams) return;
    this.teams = this.allTeams.filter(team => {
      const matchesRegion = this.selectedRegion ? team.regionName === this.selectedRegion : true;
      const matchesSearch = this.searchTerm ? (
        (team.name && team.name.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (team.loginId && team.loginId.toString().includes(this.searchTerm))
      ) : true;
      return matchesRegion && matchesSearch;
    });
  }

  openEditModal(team: Team) {
    if (this.activeEventId && team.id) {
      this.teamService.getTeam(this.activeEventId, team.id).pipe(take(1)).subscribe(t => {
        this.teamToEdit = t
        this.originalTeam = JSON.parse(JSON.stringify(t))
        this.editModalOpen = true
      })
    }
  }

  closeModal() {
    this.editModalOpen = false
    this.teamToEdit = undefined
    this.originalTeam = undefined
  }

  saveTeam() {
    if (this.teamToEdit && this.activeEventId && this.originalTeam) {
      const changes: string[] = []
      const original = this.originalTeam
      const current = this.teamToEdit

      if (original.name !== current.name) changes.push(`Nimi: '${original.name}' -> '${current.name}'`)
      if (original.loginId !== current.loginId) changes.push(`Login ID: ${original.loginId} -> ${current.loginId}`)
      if (original.fuksiStatus !== current.fuksiStatus) changes.push(`Fuksi status: ${original.fuksiStatus ? 'Kyllä' : 'Ei'} -> ${current.fuksiStatus ? 'Kyllä' : 'Ei'}`)
      if (original.regionName !== current.regionName) changes.push(`Alue: ${original.regionName} -> ${current.regionName}`)
      if (original.internalComment !== current.internalComment) changes.push(`Kommentti: '${original.internalComment || ''}' -> '${current.internalComment || ''}'`)

      current.bars.forEach(newBar => {
        const oldBar = original.bars.find(b => b.id === newBar.id)
        if (oldBar && oldBar.score !== newBar.score) {
          changes.push(`Pisteet baarista ${newBar.name}: ${oldBar.score} -> ${newBar.score}`)
        }
      })

      if (current.bonusBar && original.bonusBar && current.bonusBar.score !== original.bonusBar.score) {
        changes.push(`Bonus pisteet: ${original.bonusBar.score} -> ${current.bonusBar.score}`)
      }

      const logDetails = changes.length > 0 ? changes.join(', ') : 'Ei havaittuja muutoksia'

      this.teamService.updateTeam(this.activeEventId, this.teamToEdit).then(() => {
        this.messageService.add({message: 'Tiimi päivitetty', status: Status.Success})
        
        const log: AdminLog = {
          timestamp: new Date(),
          adminEmail: this.currentUser?.email || 'Unknown',
          action: 'Päivitti tiimin tietoja',
          details: `Tiimi: ${current.name} (${current.loginId}). Muutokset: ${logDetails}`,
          targetId: current.id
        }
        this.adminLogService.addLog(log, this.activeEventId!)

        this.closeModal()
      }).catch(error => {
        this.messageService.add({message: 'Virhe päivityksessä: ' + error, status: Status.Error})
      })
    }
  }

  deleteTeam() {
    if (this.teamToEdit && this.activeEventId && confirm('Haluatko varmasti poistaa tiimin?')) {
      this.teamService.deleteTeam(this.activeEventId, this.teamToEdit.id!).then(() => {
        this.messageService.add({message: 'Tiimi poistettu', status: Status.Success})
        this.closeModal()
      }).catch(error => {
        this.messageService.add({message: 'Virhe poistossa: ' + error, status: Status.Error})
      })
    }
  }

  deleteBonusBar() {
    if (this.teamToEdit && this.activeEventId && this.teamToEdit.bonusBar && confirm('Haluatko varmasti poistaa bonusbaarin?')) {
      this.teamService.removeBonusBar(this.activeEventId, this.teamToEdit.id!).then(success => {
        if (success) {
          delete this.teamToEdit!.bonusBar;
          
          // Recalculate total score
          this.teamToEdit!.totalScore = this.teamToEdit!.bars.reduce((total, bar) => total + bar.score, 0);
          
          // Update team to save new score
          this.teamService.updateTeam(this.activeEventId!, this.teamToEdit!).then(() => {
            this.messageService.add({message: 'Bonusbaari poistettu', status: Status.Success});
            // Update originalTeam so subsequent saves are consistent
            this.originalTeam = JSON.parse(JSON.stringify(this.teamToEdit));
          });
        } else {
          this.messageService.add({message: 'Virhe bonusbaarin poistossa', status: Status.Error});
        }
      });
    }
  }

}
