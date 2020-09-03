import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrangeModalPageRoutingModule } from './orange-modal-routing.module';
import { OrangeModalPage } from './orange-modal.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrangeModalPageRoutingModule
  ],
  declarations: []
})
export class OrangeModalPageModule {}
