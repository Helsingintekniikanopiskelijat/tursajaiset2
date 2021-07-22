import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {CompParameter, MultiCompParameter} from 'src/app/models/editor-component-holder.model';
import {decode} from 'html-entities';
@Component({
  selector: 'app-article-block',
  templateUrl: './article-block.component.html',
  styleUrls: ['./article-block.component.css']
})
export class ArticleBlockComponent implements OnInit {
  @Input() singleParams: CompParameter[] = []
  @Input() repeaterParams: MultiCompParameter[] = []
  @ViewChild('content') contentDiv?: ElementRef;
  title: string = ''
  titleId: string = ''
  author: string = ''
  contentBlocks: {imageUrl: string, content: string}[] = []
  constructor() { }

  ngAfterViewInit() {
    this.contentBlocks.forEach((block, index) => {
      if (block.imageUrl)
        this.contentDiv!.nativeElement.innerHTML += `<image class="article-image" src="${block.imageUrl}" alt="">`
      this.contentDiv!.nativeElement.innerHTML += block.content
    })
  }

  ngOnInit() {
    this.title = this.singleParams[0].value
    this.titleId = this.title.replace(/\s+/g, '')

    this.author = this.singleParams[1].value
    this.repeaterParams[0].params.forEach(param => {
      this.contentBlocks.push({imageUrl: param.compParamValues[0].value, content: decode(param.compParamValues[1].value)})
    })


  }

}
