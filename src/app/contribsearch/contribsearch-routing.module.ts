import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContribsearchPage } from './contribsearch.page';

const routes: Routes = [
  {
    path: '',
    component: ContribsearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContribsearchPageRoutingModule {}
