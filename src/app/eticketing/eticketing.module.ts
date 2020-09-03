import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EticketingPageRoutingModule } from './eticketing-routing.module';

import { EticketingPage } from './eticketing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EticketingPageRoutingModule
  ],
  declarations: [EticketingPage]
})
export class EticketingPageModule {}
