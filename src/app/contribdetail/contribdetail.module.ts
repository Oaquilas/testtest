import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContribdetailPageRoutingModule } from './contribdetail-routing.module';

import { ContribdetailPage } from './contribdetail.page';
import { OrangeModalPage } from '../orange-modal/orange-modal.page';
import { OrangeModalPageModule } from '../orange-modal/orange-modal.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContribdetailPageRoutingModule,
    OrangeModalPageModule
  ],
  declarations: [ContribdetailPage, OrangeModalPage],
  entryComponents: [OrangeModalPage]
})
export class ContribdetailPageModule {}
