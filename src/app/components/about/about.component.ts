import {Component, OnInit, ComponentFactoryResolver, ViewContainerRef, Input} from '@angular/core';
import {CompParameter, MultiCompParameter} from 'src/app/models/editor-component-holder.model';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  @Input() singleParams: CompParameter[] = []
  @Input() repeaterParams: MultiCompParameter[] = []


  title?: string
  content?: string
  constructor() {
  }

  ngOnInit() {
    this.title = this.singleParams[0]?.value
    this.content = this.singleParams[1]?.value
  }

}