import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FrontendRoutingModule} from './frontend-routing.module';
import {FrontendLoadingComponent} from '../components/frontend-loading/frontend-loading.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {FooterComponent} from './footer/footer.component';
import {FrontendComponent} from './frontend.component';
import {FrontendLoginComponent} from './frontend-login/frontend-login.component';
import {FormsModule} from '@angular/forms';
import {RastiAdminComponent} from './rasti-admin/rasti-admin.component';
import {TursasHeaderComponent} from './tursas-header/tursas-header.component';
import {FuksiStatusComponent} from './fuksi-status/fuksi-status.component';
import {AddPointsComponent} from './add-points/add-points.component';
import {TeamPageComponent} from './team-page/team-page.component';
import {TeamNameComponent} from './team-name/team-name.component';
import {OpenBarComponent} from './open-bar/open-bar.component';
import {SlideToOpenComponent} from '../components/slide-to-open/slide-to-open.component';
import {EventInfoComponent} from './event-info/event-info.component';
import {ScoreDataService} from '../services/admin-services/score-data.service';

@NgModule({
  declarations: [
    FrontendLoadingComponent,
    NotFoundComponent,
    FooterComponent,
    FrontendComponent,
    FrontendLoginComponent,
    RastiAdminComponent,
    TursasHeaderComponent,
    FuksiStatusComponent,
    AddPointsComponent,
    TeamPageComponent,
    TeamNameComponent,
    OpenBarComponent,
    SlideToOpenComponent,
    EventInfoComponent
  ],
  imports: [
    CommonModule,
    FrontendRoutingModule,
    FormsModule
  ]
  ,
  providers: [ScoreDataService]
})
export class FrontendModule { }