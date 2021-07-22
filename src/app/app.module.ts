import {NgModule} from '@angular/core';
import {BrowserModule, BrowserTransferStateModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {AngularFireAuthModule} from '@angular/fire/auth';

import {firebaseConfig} from '../../configs'
import {FormsModule} from '@angular/forms';
import {SitesService} from './services/admin-services/sites.service';
import {CommonModule} from '@angular/common';
import {ImageService} from './services/admin-services/image.service';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule.withServerTransition({appId: 'Longvinter'}),
    FormsModule,
    BrowserTransferStateModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule, // storage
    AppRoutingModule,
  ],
  providers: [SitesService, ImageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
