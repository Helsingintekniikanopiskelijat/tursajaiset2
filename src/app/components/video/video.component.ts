import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {CompParameter, MultiCompParameter} from 'src/app/models/editor-component-holder.model';
import {decode} from 'html-entities';
@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {
  @Input() singleParams: CompParameter[] = []
  @Input() repeaterParams: MultiCompParameter[] = []
  @ViewChild('content') contentDiv?: ElementRef
  @ViewChild('video') videoDiv?: ElementRef

  title: string = ''
  titleId: string = ''
  textContent: string = ''
  videoUrl: string = ''
  side: boolean = false
  constructor() { }

  ngAfterViewInit() {
    if (this.textContent != '')
      this.contentDiv!.nativeElement.innerHTML = this.textContent
    //let videoIframe = '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/' + this.videoUrl + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'

    this.videoDiv!.nativeElement.innerHTML = this.videoUrl
  }

  ngOnInit() {
    this.title = this.singleParams[0]?.value
    this.titleId = this.title.replace(/\s+/g, '')
    this.textContent = decode(this.singleParams[1]?.value)
    this.videoUrl = this.singleParams[2]?.value

    this.side = this.singleParams[3]?.value
  }

}
