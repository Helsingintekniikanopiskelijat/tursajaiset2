import {Component, HostListener, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CompParameter, MultiCompParameter} from 'src/app/models/editor-component-holder.model';

@Component({
  selector: 'app-site-navigation',
  templateUrl: './site-navigation.component.html',
  styleUrls: ['./site-navigation.component.css']
})
export class SiteNavigationComponent implements OnInit {
  @Input() singleParams: CompParameter[] = []
  @Input() repeaterParams: MultiCompParameter[] = []
  sticky = false
  stickToTop = false
  side = false
  titles: {text: string, id: string}[] | null = null
  main: HTMLElement | null
  menuOffset = 0
  constructor(
    private route: ActivatedRoute,
  ) {
    this.main = document.querySelector('main')
  }

  ngOnInit() {
    let menu = document.querySelector('#navigation-menu') as HTMLElement
    this.menuOffset = menu!.offsetTop + 100
    this.side = this.singleParams[0].value
    this.sticky = this.singleParams[1].value
    if (this.sticky)
      this.main?.addEventListener('scroll', () => this.scrollEvent(), true);
    setTimeout(() => {
      this.titles = []
      let elements = document.querySelectorAll('.article-title')
      elements.forEach(element => {
        this.titles!.push({text: element.firstChild?.textContent ?? '', id: element.id})
      })
    }, 1000)
  }

  scrollEvent() {
    let mainOffset = this.main?.scrollTop
    if (mainOffset != undefined && this.menuOffset != undefined && this.sticky == true) {
      if (mainOffset > this.menuOffset && this.stickToTop == false) {
        this.stickToTop = true
      }
      else if (mainOffset < this.menuOffset && this.stickToTop == true)
        this.stickToTop = false
    }
  }



  scrollToLink(id: string) {
    let route = this.route.snapshot.paramMap.get('route') ?? ''
    let tempCategory = this.route.snapshot.paramMap.get('category') ?? ''
    let el = document.getElementById(id);
    history.replaceState({}, '', tempCategory + '/' + route + '/#' + id)
    el!.scrollIntoView({behavior: 'smooth'});
  }

}
