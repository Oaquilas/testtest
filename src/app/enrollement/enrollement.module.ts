import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnrollementPageRoutingModule } from './enrollement-routing.module';

import { EnrollementPage } from './enrollement.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnrollementPageRoutingModule
  ],
  declarations: [EnrollementPage]
})
export class EnrollementPageModule {}
