import {Component, Input, OnInit} from '@angular/core';
import {Bar} from 'src/app/models/bar.model';
import {Status} from 'src/app/models/site-message.model';
import {Team} from 'src/app/models/team.model';
import {MessagesService} from 'src/app/services/admin-services/messages.service';
import {TeamService} from 'src/app/services/team.service';

@Component({
  selector: 'app-open-bar',
  templateUrl: './open-bar.component.html',
  styleUrls: ['./open-bar.component.css']
})
export class OpenBarComponent implements OnInit {
  @Input() barIndex?: number
  @Input() team?: Team
  @Input() eventId?: string
  teamName = ''
  compLoading = false
  constructor(private teamService: TeamService, private messageService: MessagesService) { }

  ngOnInit() {

  }

  async openBar() {
    this.compLoading = true
    if (this.eventId != undefined && this.barIndex != undefined && this.team != undefined) {
      this.team.bars[this.barIndex].revealed = true
      await this.teamService.updateTeam(this.eventId, this.team)
      this.compLoading = false
      this.hideAddPage()
      this.messageService.add({message: 'Vihje avattu', status: Status.Success})
    } else {
      this.compLoading = false
      this.messageService.add({message: 'Virhe vihjeen avauksessa', status: Status.Error})
    }
  }

  hideAddPage() {
    document.querySelector("#open-bar")?.classList.add('overlay-hidden')
    let overlay = document.querySelector("#hide-openBar") as any
    overlay.style.display = "none"
  }
}
