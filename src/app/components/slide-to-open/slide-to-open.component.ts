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
  completed = false
  @Output() OpenBarEvent = new EventEmitter()
  constructor() {

  }

  ngAfterViewInit() {

  }

  ngOnInit() {
    document.addEventListener('touchmove', (event: any) => {
      if (this.listenEvents) {
        const width = this.sliderContainer.nativeElement.offsetWidth
        const start = this.sliderContainer.nativeElement.offsetLeft
        const mouseLeft = event.touches[0].clientX
        const progress = (mouseLeft - start * 2) / (width - start)
        if (  progress >= 0 && progress < 0.81)
          this.progress = progress
        else if (progress > 0.8)
          this.completed = true
      }
    })
    document.addEventListener('mousemove', (event: any) => {
      if (this.listenEvents) {
        const width = this.sliderContainer.nativeElement.offsetWidth
        const start = this.sliderContainer.nativeElement.offsetLeft
        const mouseLeft = event.clientX
        const progress = (mouseLeft - start * 2) / (width - start)
        if (progress >= 0 && progress < 0.81)
          this.progress = progress
        else if (progress > 0.8)
          this.completed = true
      }
    })
    document.addEventListener('mouseup', (event: any) => {
      this.listenEvents = false
      if (!this.completed) this.progress = 0
      else
        this.OpenBarEvent.emit()
    })
    document.addEventListener('touchend', (event: any) => {
      this.listenEvents = false
      if (!this.completed) this.progress = 0
      else
        this.OpenBarEvent.emit()
    })
  }

  movingSlider(event: any) {
    this.listenEvents = true
  }
  stopListen() {
    this.listenEvents = false
  }
}