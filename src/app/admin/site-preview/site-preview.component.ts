import {Component, OnInit, ComponentFactoryResolver, ViewContainerRef, Input} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentSnapshot} from '@angular/fire/firestore';
import {Meta, Title, TransferState, makeStateKey} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {startWith} from 'rxjs/operators';
import {Site} from 'src/app/models/site.model';
import {ComponentInstanceService} from 'src/app/services/admin-services/component-instance.service';
import {SitesService} from 'src/app/services/admin-services/sites.service';

@Component({
  selector: 'site-preview',
  templateUrl: './site-preview.component.html',
  styleUrls: ['./site-preview.component.css']
})
export class SitePreviewComponent implements OnInit {
  @Input() previewId?: string // Used in admin panel when previewing
  @Input() previewCategory?: string
  site?: Site

  constructor(private firestore: AngularFirestore,
    private cfr: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private componentService: ComponentInstanceService,) { }

  ngOnInit() {
    const containerRef = this.viewContainerRef
    const document = this.firestore.collection("lvSiteCollection").doc(this.previewCategory).collection('sites').doc<Site>(this.previewId).valueChanges().subscribe((site) => {
      if (site == undefined)
        return

      containerRef.clear()
      site.components?.forEach(component => {

        if (this.componentService.getComponent(component.type) != undefined) {
          const componentFactory = this.cfr.resolveComponentFactory(this.componentService.getComponent(component.type))
          const componentRef = containerRef.createComponent(componentFactory)
          let componentInstance = componentRef.instance as any
          componentInstance.singleParams = component.singleParams
          componentInstance.repeaterParams = component.repeaterParams
        }
      })
    })
  }

}
