import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContribdetailPage } from './contribdetail.page';

const routes: Routes = [
  {
    path: '',
    component: ContribdetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContribdetailPageRoutingModule {}
