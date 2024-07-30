import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, BaseRouteReuseStrategy } from '@angular/router';
import { Bar } from 'src/app/models/bar.model';
import { Team } from 'src/app/models/team.model';
import { EventService } from 'src/app/services/admin-services/event.service';
import { AdverDataService } from 'src/app/services/adver-data.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-team-page',
  templateUrl: './team-page.component.html',
  styleUrls: ['./team-page.component.css']
})
export class TeamPageComponent implements OnInit {
  teamId: string
  eventId: string
  barToOpenIndex?: number
  team?: Team
  constructor(
    private route: ActivatedRoute,
    private teamService: TeamService,
    private eventService: EventService,
    private advertService: AdverDataService
  ) {
    const id = this.route.snapshot.paramMap.get('id')
    const eventId = this.route.snapshot.paramMap.get('eventId')
    if (id != null && eventId != null) {
      this.teamId = id
      this.eventId = eventId
    }
    else {
      this.teamId = ''
      this.eventId = ''
      window.location.href = `/login`
    }
  }
  ngOnInit() {
    console.log('event id', this.eventId)
    this.teamService.getTeam(this.eventId, this.teamId).subscribe(team => {
      if (team == undefined) {
        window.location.href = `/login`
      }
      else {
        if (team.bonusBar != undefined) {
          team.bonusBar.name = "Bonus: "+ team.bonusBar.name
          team.bars.push(team.bonusBar)
        }
        this.team = team
        if (team.name == undefined)
          this.showNameTab()
      }
    })
  }

  async advertClick() {
    await this.advertService.addAdverData({ time: new Date() }, this.eventId)
    window.open('https://kide.app/events/e6aa140f-0ecd-45c8-a626-9b4797af3506', '_blank');
  }

  showNameTab() {
    document.querySelector("#team-name")?.classList.remove('overlay-hidden')
    let overlay = document.querySelector("#hide-team-name") as any
    overlay.style.display = "initial"
  }

  showOpenBar(barIndex: number, bar: Bar) {
    if (bar.revealed)
      return
    this.barToOpenIndex = barIndex
    document.querySelector("#open-bar")?.classList.remove('overlay-hidden')
    let overlay = document.querySelector("#hide-openBar") as any
    overlay.style.display = "initial"
  }
  changeHintLanguage(barIndex: number, bar: Bar) {
    bar.finnish = !bar.finnish
  }
}
