import {isPlatformBrowser} from '@angular/common';
import {Component, OnInit, ComponentFactoryResolver, ViewContainerRef, Input, Optional, Inject, PLATFORM_ID} from '@angular/core';
import {Meta, Title, TransferState, makeStateKey, StateKey} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {Site} from 'src/app/models/site.model';
import {ComponentInstanceService} from 'src/app/services/admin-services/component-instance.service';
import {customNavigationData} from 'src/site-data/site-navigation.data';
import {NotFoundComponent} from '../not-found/not-found.component';



@Component({
  selector: 'site-viewing',
  templateUrl: './site-viewing.component.html',
  styleUrls: ['./site-viewing.component.css']
})

export class SiteViewingComponent implements OnInit {
  site?: Site
  category: string
  componentReady?: Observable<any>
  SITE_DATA: StateKey<Site>
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject('site_data') public siteData: Site,
    private title: Title,
    private state: TransferState, private cfr: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private componentService: ComponentInstanceService,
    private route: ActivatedRoute,
    private meta: Meta) {

    this.SITE_DATA = makeStateKey<Site>('siteData')
    if (isPlatformBrowser(this.platformId))//get message from transferState if browser side
    {
      this.site = this.state.get(this.SITE_DATA, {} as Site);
    }
    else //server side: get provided message and store in in transfer state
    {
      this.state.set(this.SITE_DATA, this.siteData);
    }
    this.category = this.route.snapshot.paramMap.get('category') ?? 'default'
  }

  ngOnInit() {

    const exists = this.state.get(this.SITE_DATA, {} as Site)
    if (exists == null) {
      const containerRef = this.viewContainerRef
      const componentFactory = this.cfr.resolveComponentFactory(NotFoundComponent)
      containerRef.createComponent(componentFactory)
      return
    }
    const definedCategories = customNavigationData()
    let route = this.route.snapshot.paramMap.get('route')
    let tempCategory = this.route.snapshot.paramMap.get('category')
    if (route == null) {
      let knownCategory = false;
      definedCategories.mainLinks.forEach(link => {
        if (link.categoryMainSite.navigationUrl == tempCategory)
          knownCategory = true
      })
      if (knownCategory)
        route = 'frontpage'
      else {
        route = tempCategory
        tempCategory = 'default'
      }
    }
    if (tempCategory == null) {
      this.category = 'default'
    }
    else {
      this.category = tempCategory
    }

    if (exists.id != undefined) {
      this.site = exists
      this.buildSite()
    }
    else {
      const containerRef = this.viewContainerRef
      const componentFactory = this.cfr.resolveComponentFactory(NotFoundComponent)
      containerRef.createComponent(componentFactory)
      return
    }
  }

  buildSite() {
    if (this.site != undefined) {
      this.site.components?.forEach(component => {
        if (this.componentService.getComponent(component.type) != undefined) {
          const containerRef = this.viewContainerRef
          const componentFactory = this.cfr.resolveComponentFactory(this.componentService.getComponent(component.type))
          try {
            const componentRef = containerRef.createComponent(componentFactory)
            let componentInstance = componentRef.instance as any
            componentInstance.singleParams = component.singleParams
            componentInstance.repeaterParams = component.repeaterParams
          } catch (error) {
          }
        }
      })
      this.title.setTitle(this.site.title)
      this.meta.addTags(this.site.metaTags)
    }
  }
}


