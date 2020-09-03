import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DoublonsContribuablePage } from './doublons-contribuable.page';

const routes: Routes = [
  {
    path: '',
    component: DoublonsContribuablePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoublonsContribuablePageRoutingModule {}
