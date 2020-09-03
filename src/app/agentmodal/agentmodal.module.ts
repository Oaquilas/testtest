import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgentmodalPageRoutingModule } from './agentmodal-routing.module';

import { AgentmodalPage } from './agentmodal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgentmodalPageRoutingModule
  ],
  declarations: [AgentmodalPage]
})
export class AgentmodalPageModule {}
