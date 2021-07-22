import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FrontendComponent} from './frontend.component';
import {NotFoundComponent} from './not-found/not-found.component';

const routes: Routes = [
  {path: ':category', component: FrontendComponent},
  {path: ':category/:route', component: FrontendComponent},
  {path: '', redirectTo: '/news', pathMatch: 'full'},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontendRoutingModule { }
