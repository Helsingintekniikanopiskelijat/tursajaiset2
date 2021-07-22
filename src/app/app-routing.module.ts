import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FrontendComponent} from './frontend/frontend.component';

const routes: Routes = [
  {path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)},
  {path: '', loadChildren: () => import('./frontend/frontend.module').then(m => m.FrontendModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
  })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
