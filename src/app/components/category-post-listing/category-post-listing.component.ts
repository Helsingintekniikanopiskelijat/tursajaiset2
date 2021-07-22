import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CompParameter, MultiCompParameter} from 'src/app/models/editor-component-holder.model';
import {Site} from 'src/app/models/site.model';
import {SitesService} from 'src/app/services/admin-services/sites.service';

@Component({
  selector: 'app-category-post-listing',
  templateUrl: './category-post-listing.component.html',
  styleUrls: ['./category-post-listing.component.css']
})
export class CategoryPostListingComponent implements OnInit {
  @Input() singleParams: CompParameter[] = []
  @Input() repeaterParams: MultiCompParameter[] = []
  initialPostFetchAmount: number = 2
  category: string
  sites: Site[] | null = null
  newsEnded = false
  constructor(private siteService: SitesService, private route: ActivatedRoute) {
    this.category = this.route.snapshot.paramMap.get('category') ?? 'default'
  }

  async ngOnInit() {
    this.initialPostFetchAmount = this.singleParams[0]?.value
    this.sites = await this.siteService.getSitesInCategoryFirstQuery(this.category, this.initialPostFetchAmount)
  }

  async getMoreSites() {
    const moreSites = await this.siteService.getNextBatchOfSites()
    if (moreSites == null) {
      this.newsEnded = true
    }
    else
      moreSites.forEach(site => this.sites?.push(site))
  }

  filterImageFromtags(tags: {name: string, content: string}[]): string {
    let imageSource = 'https://firebasestorage.googleapis.com/v0/b/longvinter-promo.appspot.com/o/public%2Flongvinter-basic-image.jpg?alt=media&token=3e6b3a15-cce1-4068-ac82-145df142b794'
    tags.forEach(tag => {
      if (tag.name == 'og:image') {
        imageSource = tag.content
      }
    })
    return imageSource
  }
  filterDescriptionFromtags(tags: {name: string, content: string}[]): string[] {
    let description = ''
    tags.forEach(tag => {
      if (tag.name == 'description') {
        description = tag.content
      }
    })
    return [description]
  }

  loadNewPage(url: string) {
    window.open(url,"_self")
  }
}
