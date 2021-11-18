import {Component, OnInit} from '@angular/core';
import {Team} from 'src/app/models/team.model';
import {EventService} from 'src/app/services/admin-services/event.service';
import {MessagesService} from 'src/app/services/admin-services/messages.service';
import {TeamService} from 'src/app/services/team.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['../admin-styles-2.css', '../admin-styles.css', './settings.component.css']
})
export class SettingsComponent implements OnInit {

  teams?: Team[]
  noActiveEvent = false
  constructor(private teamService: TeamService, private messageService: MessagesService, private eventService: EventService) { }

  ngOnInit() {
    this.eventService.getActiveTursasEvent().subscribe((events) => {
      if (events.length > 0)
        this.teamService.getBestFuksiTeamShortedByScore(events[0].id!).subscribe((teams) => {
          this.teams = teams
        })
      else
        this.noActiveEvent = true
    })

  }

}
