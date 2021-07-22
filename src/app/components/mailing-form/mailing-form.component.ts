import {Component, Input, OnInit} from '@angular/core';
import {CompParameter, MultiCompParameter} from 'src/app/models/editor-component-holder.model';

@Component({
  selector: 'app-mailing-form',
  templateUrl: './mailing-form.component.html',
  styleUrls: ['./mailing-form.component.css']
})
export class MailingFormComponent implements OnInit {
  @Input() singleParams: CompParameter[] = []
  @Input() repeaterParams: MultiCompParameter[] = []

  normalTextShown = false
  constructor() { }

  ngOnInit(): void {
    if(this.singleParams[0] != undefined)
    this.normalTextShown = this.singleParams[0]?.value
  }

}
