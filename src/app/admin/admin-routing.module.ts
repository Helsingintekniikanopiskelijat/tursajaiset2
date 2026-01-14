import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from './admin.component';
import {SettingsComponent} from './settings/settings.component';
import {EventComponent} from './event/event.component';
import {RegionComponent} from './region/region.component';
import {BarsComponent} from './bars/bars.component';
import {AdminLaunchComponent} from './admin-launch/admin-launch.component';
import {AdminLogsComponent} from './admin-logs/admin-logs.component';

const routes: Routes = [
  {
    path: '', component: AdminComponent, children: [
      {path: 'launch', component: AdminLaunchComponent},
      {path: 'events', component: EventComponent},
      {path: 'bars', component: BarsComponent},
      {path: 'regions', component: RegionComponent},
      {path: 'settings', component: SettingsComponent},
      {path: 'logs', component: AdminLogsComponent},
      {path: '', redirectTo: '/admin/launch', pathMatch: 'full'},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
