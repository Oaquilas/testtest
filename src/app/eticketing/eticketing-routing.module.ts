import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EticketingPage } from './eticketing.page';

const routes: Routes = [
  {
    path: '',
    component: EticketingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EticketingPageRoutingModule {}
