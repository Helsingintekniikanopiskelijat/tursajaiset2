import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-slide-to-open',
  templateUrl: './slide-to-open.component.html',
  styleUrls: ['./slide-to-open.component.css']
})
export class SlideToOpenComponent implements OnInit {
  @ViewChild('sliderContainer') sliderContainer?: any
  listenEvents = false
  progress = 0
  clicked = false
  @Output() OpenBarEvent = new EventEmitter()
  constructor() {

  }

  ngAfterViewInit() {

  }

  openClick() {
    if (!this.clicked)
      this.clicked = true
    else
      this.OpenBarEvent.emit()
  }

  ngOnInit() {
  }

  movingSlider(event: any) {
    this.listenEvents = true
  }
  stopListen() {
    this.listenEvents = false
  }
}