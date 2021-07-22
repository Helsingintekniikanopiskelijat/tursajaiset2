import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent implements OnInit {
  @Input() params: any

  title: string | undefined
  constructor() { }

  ngOnInit(): void {
    this.title = this.params[0].value
  }

}
