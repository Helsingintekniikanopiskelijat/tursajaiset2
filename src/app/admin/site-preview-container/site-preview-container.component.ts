import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-site-preview-container',
  templateUrl: './site-preview-container.component.html',
  styleUrls: ['./site-preview-container.component.css']
})
export class SitePreviewContainerComponent implements OnInit {
  category: string
  siteId: string
  constructor(private route: ActivatedRoute,) {
    this.category = this.route.snapshot.paramMap.get('category') ?? 'default'
    this.siteId = this.route.snapshot.paramMap.get('id') ?? 'frontpage'
  }

  ngOnInit() {
  }

}
