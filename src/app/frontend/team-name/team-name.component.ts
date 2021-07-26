import {Component, Input, OnInit} from '@angular/core';
import {Status} from 'src/app/models/site-message.model';
import {Team} from 'src/app/models/team.model';
import {MessagesService} from 'src/app/services/admin-services/messages.service';
import {TeamService} from 'src/app/services/team.service';

@Component({
  selector: 'app-team-name',
  templateUrl: './team-name.component.html',
  styleUrls: ['./team-name.component.css']
})
export class TeamNameComponent implements OnInit {

  @Input() team?: Team
  @Input() eventId?: string
  teamName = ''
  compLoading = false
  constructor(private teamService: TeamService, private messageService: MessagesService) { }

  ngOnInit() {

  }

  async updateTeamName() {
    if (this.teamName.length > 50) {
      this.messageService.add({message: 'Liian pitkä nimi bro😁', status: Status.Error})
      return
    }
    this.compLoading = true
    if (this.team != undefined && this.eventId != undefined) {
      this.team.name = this.teamName
      await this.teamService.updateTeam(this.eventId, this.team)
      this.compLoading = false
      this.hideAddPage()
      this.messageService.add({message: 'Onnea matkaan👩‍🎓👨‍🎓', status: Status.Success})
    }
  }

  hideAddPage() {
    document.querySelector("#team-name")?.classList.add('overlay-hidden')
    let overlay = document.querySelector("#hide-team-name") as any
    overlay.style.display = "none"
  }
}
