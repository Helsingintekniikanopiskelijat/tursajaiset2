import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {CompParameter, MultiCompParameter} from 'src/app/models/editor-component-holder.model';
import {decode} from 'html-entities';
@Component({
  selector: 'app-image-resource',
  templateUrl: './image-resource.component.html',
  styleUrls: ['./image-resource.component.css']
})
export class ImageResourceComponent implements OnInit {
  @Input() singleParams: CompParameter[] = []
  @Input() repeaterParams: MultiCompParameter[] = []
  @ViewChild('content') contentDiv?: ElementRef

  title: string = ''
  titleId: string = ''
  textContent: string = ''
  downloadUrl: string = ''
  galleryImages: {imageUrl: string}[] = []
  constructor() { }

  ngAfterViewInit() {
    if (this.textContent != '')
      this.contentDiv!.nativeElement.innerHTML = this.textContent
  }

  ngOnInit() {
    this.title = this.singleParams[0]?.value
    this.titleId = this.title.replace(/\s+/g, '')
    this.downloadUrl = this.singleParams[1]?.value
    this.textContent = decode(this.singleParams[2]?.value)
    this.repeaterParams[0].params.forEach(param => {
      this.galleryImages.push({imageUrl: param.compParamValues[0].value})
    })
  }

  downloadLink(url:string) {
    window.open(url)
  }

}
