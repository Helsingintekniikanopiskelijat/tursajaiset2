import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from './admin.component';
import {ImageGalleryComponent} from './gallery/image-gallery/image-gallery.component';
import {SettingsComponent} from './settings/settings.component';
import {SitePreviewContainerComponent} from './site-preview-container/site-preview-container.component';
import {EventComponent} from './event/event.component';
import {RegionComponent} from './region/region.component';

const routes: Routes = [
  {
    path: '', component: AdminComponent, children: [
      {path: 'events', component: EventComponent},
      {path: 'regions', component: RegionComponent},
      {path: 'settings', component: SettingsComponent},
      {path: '', redirectTo: '/admin/events', pathMatch: 'full'},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
