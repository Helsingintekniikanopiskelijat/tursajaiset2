import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EventInfoComponent} from './event-info/event-info.component';
import {FrontendLoginComponent} from './frontend-login/frontend-login.component';
import {FrontendComponent} from './frontend.component';
import {RastiAdminComponent} from './rasti-admin/rasti-admin.component';
import {TeamPageComponent} from './team-page/team-page.component';

const routes: Routes = [
  {
    path: '', component: FrontendComponent, children: [
      {path: 'info', component: EventInfoComponent},
      {path: 'login', component: FrontendLoginComponent},
      {path: 'rastinpito', component: RastiAdminComponent},
      {path: 'teams/:eventId/:id', component: TeamPageComponent},
      {path: '', redirectTo: '/login', pathMatch: 'full'},
      {path: '**', redirectTo: '/login'}
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontendRoutingModule { }
