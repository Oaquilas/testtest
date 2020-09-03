import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgentmodalPage } from './agentmodal.page';

const routes: Routes = [
  {
    path: '',
    component: AgentmodalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgentmodalPageRoutingModule {}
