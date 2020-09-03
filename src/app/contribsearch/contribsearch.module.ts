import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContribsearchPageRoutingModule } from './contribsearch-routing.module';

import { ContribsearchPage } from './contribsearch.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContribsearchPageRoutingModule
  ],
  declarations: [ContribsearchPage]
})
export class ContribsearchPageModule {}
