import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'navigation-header',
  templateUrl: './navigation-header.component.html',
  styleUrls: ['./navigation-header.component.css']
})
export class NavigationHeaderComponent implements OnInit {

  category: string
  originalCategory: string
  constructor(private route: ActivatedRoute) {
    this.category = this.route.snapshot.paramMap.get('category') ?? ''
    this.originalCategory = this.route.snapshot.paramMap.get('category') ?? ''
  }

  switchcategory(newCategory: string){
    this.category = newCategory
  }

  ngOnInit() {
  }

}
