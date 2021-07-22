import {ApplicationRef, Component, ComponentFactoryResolver, ElementRef, Injector, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {CompParameter, MultiCompParameter} from 'src/app/models/editor-component-holder.model';
import {decode} from 'html-entities';

@Component({
  selector: 'image-banner',
  templateUrl: './image-banner.component.html',
  styleUrls: ['./image-banner.component.css']
})
export class ImageBannerComponent implements OnInit {
  @Input() singleParams: CompParameter[] = []
  @Input() repeaterParams: MultiCompParameter[] = []

  @Input() uniqueId?: string
  @ViewChild('content') contentDiv?: ElementRef;
  title?: string
  content?: string
  showButton?: boolean
  buttonText: string = ''
  buttonLink: string = ''
  imageUrl?: string
  bannerHeight: boolean = false
  bannerWidth: boolean = true
  constructor(private renderer: Renderer2) {
  }

  ngAfterViewInit() {
    this.contentDiv!.nativeElement.innerHTML = this.content
  }

  ngOnInit() {
    this.title = this.singleParams[0]?.value

    this.content = decode(this.singleParams[1]?.value)
    this.showButton = this.singleParams[2]?.value
    this.buttonText = this.singleParams[3]?.value
    this.buttonLink = this.singleParams[4]?.value
    this.imageUrl = this.singleParams[5]?.value
    this.bannerHeight = this.singleParams[6]?.value
    this.bannerWidth = this.singleParams[7]?.value
  }

  goToSteam() {
    window.open(this.buttonLink)
  }
}

