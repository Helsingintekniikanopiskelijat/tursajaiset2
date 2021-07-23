import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AdminRoutingModule} from './admin-routing.module';
import {LoginScreenComponent} from './login-screen/login-screen.component';
import {AddSiteComponent} from './sites/add-site/add-site.component';
import {FormsModule} from '@angular/forms';
import {SitePreviewComponent} from './site-preview/site-preview.component';
import {BrowserTransferStateModule} from '@angular/platform-browser';
import {AdminComponent} from './admin.component';
import {AdminNavigationComponent} from './admin-navigation/admin-navigation.component';
import {HttpClientModule} from '@angular/common/http';
import {ImageGalleryComponent} from './gallery/image-gallery/image-gallery.component';
import {MessagesService} from '../services/admin-services/messages.service';
import {MessagesComponent} from './messages/messages.component';
import {AddImageComponent} from './gallery/add-image/add-image.component';
import {ViewImageComponent} from './gallery/view-image/view-image.component';
import {ImagePickerComponent} from './sites/image-picker/image-picker.component';
import {SettingsComponent} from './settings/settings.component';
import {SitePreviewContainerComponent} from './site-preview-container/site-preview-container.component';
import {LoadingWithSizeComponent} from '../components/loading-with-size/loading-with-size.component';
import {EventComponent} from './event/event.component';
import {RegionComponent} from './region/region.component';
import {BarsComponent} from './bars/bars.component';


@NgModule({
  declarations: [
    LoginScreenComponent,
    AddSiteComponent,
    SitePreviewComponent,
    AdminComponent,
    AdminNavigationComponent,
    ImageGalleryComponent,
    MessagesComponent,
    AddImageComponent,
    ViewImageComponent,
    ImagePickerComponent,
    SettingsComponent,
    SitePreviewContainerComponent,
    LoadingWithSizeComponent,
    EventComponent,
    RegionComponent,
    BarsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    BrowserTransferStateModule,
    HttpClientModule,
  ],
  providers: [MessagesService]
})
export class AdminModule { }
