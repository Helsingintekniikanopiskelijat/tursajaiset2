import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AdminRoutingModule} from './admin-routing.module';
import {LoginScreenComponent} from './login-screen/login-screen.component';
import {FormsModule} from '@angular/forms';
import {BrowserTransferStateModule} from '@angular/platform-browser';
import {AdminComponent} from './admin.component';
import {AdminNavigationComponent} from './admin-navigation/admin-navigation.component';
import {HttpClientModule} from '@angular/common/http';
import {MessagesService} from '../services/admin-services/messages.service';
import {SettingsComponent} from './settings/settings.component';
import {LoadingWithSizeComponent} from '../components/loading-with-size/loading-with-size.component';
import {EventComponent} from './event/event.component';
import {RegionComponent} from './region/region.component';
import {BarsComponent} from './bars/bars.component';
import {ExpandedBarCardComponent} from './expanded-bar-card/expanded-bar-card.component';
import {AdminLaunchComponent} from './admin-launch/admin-launch.component';
import {AdminLogsComponent} from './admin-logs/admin-logs.component';


@NgModule({
  declarations: [
    LoginScreenComponent,
    AdminComponent,
    AdminNavigationComponent,
    SettingsComponent,
    LoadingWithSizeComponent,
    EventComponent,
    RegionComponent,
    BarsComponent,
    ExpandedBarCardComponent,
    AdminLaunchComponent,
    AdminLogsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    BrowserTransferStateModule,
    HttpClientModule,
  ],
  providers: []
})
export class AdminModule { }
