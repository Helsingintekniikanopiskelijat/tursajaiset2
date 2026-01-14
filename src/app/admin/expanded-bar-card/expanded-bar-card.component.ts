import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Bar} from 'src/app/models/bar.model';
import {Team} from 'src/app/models/team.model';

@Component({
  selector: 'app-expanded-bar-card',
  templateUrl: './expanded-bar-card.component.html',
  styleUrls: ['../admin-styles-2.css', '../admin-styles.css', './expanded-bar-card.component.css']
})
export class ExpandedBarCardComponent implements OnInit {

  @Input() team?: Team
  @Output() edit = new EventEmitter<Team>()
  expanded = false;
  constructor() { }

  switchExpanded() {
    this.expanded = !this.expanded
  }

  editTeam() {
    this.edit.emit(this.team)
  }

  ngOnInit() {

  }

}
