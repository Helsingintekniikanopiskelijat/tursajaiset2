import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FrontendRoutingModule} from './frontend-routing.module';
import {NavigationHeaderComponent} from '../components/header/navigation-header.component';
import {FrontendLoadingComponent} from '../components/frontend-loading/frontend-loading.component';
import {FooterComponent} from '../components/about/footer/footer.component';
import {NotFoundComponent} from './not-found/not-found.component';

@NgModule({
  declarations: [
    FrontendLoadingComponent,
    FooterComponent,
    NotFoundComponent,
    NavigationHeaderComponent
  ],
  imports: [
    CommonModule,
    FrontendRoutingModule,
  ]
})
export class FrontendModule { }