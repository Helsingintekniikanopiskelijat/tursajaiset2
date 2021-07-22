import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'frontend-loading',
  templateUrl: './frontend-loading.component.html',
  styleUrls: ['./frontend-loading.component.css']
})
export class FrontendLoadingComponent implements OnInit {
  @Input() size?: number
  @Input() color?: string
  @Input() type?: string

  styles: {display: string, placeItems: string, height?: string} = {display: 'grid', placeItems: 'center', height: '500px'}
  constructor() {
    
  }

  ngOnInit() {
    if (this.size) {
      this.styles.height = `${this.size}px`
    }
  }

}
