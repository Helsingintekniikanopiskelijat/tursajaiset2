import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Bar} from 'src/app/models/bar.model';
import {Status} from 'src/app/models/site-message.model';
import {Team} from 'src/app/models/team.model';
import {MessagesService} from 'src/app/services/admin-services/messages.service';
import {TeamService} from 'src/app/services/team.service';

@Component({
  selector: 'app-add-points',
  templateUrl: './add-points.component.html',
  styleUrls: ['./add-points.component.css']
})
export class AddPointsComponent implements OnInit {
  @Input()
  set bar(val: Bar | undefined) {
    this.score = 0
    this.comment = ''
    if (val) {
      this.score = val.score
      if (val.scoreComment)
        this.comment = val.scoreComment
    }
  }
  @Input() barIndex?: number
  @Output() PointsEvent = new EventEmitter<{score: number, comment: string, index?: number}>()
  compLoading = false
  score = 0
  comment = ''
  constructor(private teamService: TeamService, private messageService: MessagesService) { }

  ngOnInit() {

  }

  savePoints() {
    if (this.score > 120) {
      this.messageService.add({message: 'Pisteiden maximi on 120 😔', status: Status.Error})
      return
    } else if (this.score < 0) {
      this.messageService.add({message: 'Pisteiden minimi on 0 😔', status: Status.Error})
      return
    }
    else {
      this.PointsEvent.emit({score: this.score, comment: this.comment, index: this.barIndex})
      this.hideAddPage()
    }
  }

  hideAddPage() {
    document.querySelector("#add-points")?.classList.add('overlay-hidden')
    let overlay = document.querySelector("#hide-add-points") as any
    overlay.style.display = "none"
    this.score = 0
    this.comment = ''

  }
}