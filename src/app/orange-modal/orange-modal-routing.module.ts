import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrangeModalPage } from './orange-modal.page';

const routes: Routes = [
  {
    path: '',
    component: OrangeModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrangeModalPageRoutingModule {}
