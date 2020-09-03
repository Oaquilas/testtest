import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnrollementPage } from './enrollement.page';

const routes: Routes = [
  {
    path: '',
    component: EnrollementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnrollementPageRoutingModule {}
