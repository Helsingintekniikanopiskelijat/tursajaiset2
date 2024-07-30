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
      if (events.length > 0) {
        this.teamService.getBestFuksiTeamShortedByScore(events[0].id!).subscribe((teams) => {
          this.teams = teams.map(team => {
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
          this.teams.sort((a, b) => b.totalScore - a.totalScore);
        });
      } else {
        this.noActiveEvent = true;
      }
    });

  }

}
