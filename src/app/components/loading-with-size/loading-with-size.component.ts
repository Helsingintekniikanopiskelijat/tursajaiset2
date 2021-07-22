import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'loading-with-size',
  templateUrl: './loading-with-size.component.html',
  styleUrls: ['./loading-with-size.component.css']
})
export class LoadingWithSizeComponent implements OnInit {
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
