import {Component, Input, OnInit} from '@angular/core';
import {Status} from 'src/app/models/site-message.model';
import {Team} from 'src/app/models/team.model';
import {MessagesService} from 'src/app/services/admin-services/messages.service';
import {TeamService} from 'src/app/services/team.service';

@Component({
  selector: 'app-fuksi-status',
  templateUrl: './fuksi-status.component.html',
  styleUrls: ['./fuksi-status.component.css']
})
export class FuksiStatusComponent implements OnInit {
  @Input() team?: Team
  @Input() eventId?: string
  compLoading = false
  constructor(private teamService: TeamService, private messageService: MessagesService) { }

  ngOnInit() {

  }

  async setFuksiStatus(status: boolean) {
    this.compLoading = true
    if (this.team != undefined && this.eventId != undefined) {
      this.team.fuksiStatus = status
      await this.teamService.updateTeam(this.eventId, this.team)
      this.compLoading = false
      this.hideAddPage()
      this.messageService.add({message: 'Status päivitetty👩‍🎓👨‍🎓', status: Status.Success})
    }
  }

  hideAddPage() {
    document.querySelector("#fuksi-status")?.classList.add('overlay-hidden')
    let overlay = document.querySelector("#hide-fuksi-status") as any
    overlay.style.display = "none"
  }
}
