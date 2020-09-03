import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DoublonsContribuablePageRoutingModule } from './doublons-contribuable-routing.module';

import { DoublonsContribuablePage } from './doublons-contribuable.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DoublonsContribuablePageRoutingModule
  ],
  declarations: [DoublonsContribuablePage]
})
export class DoublonsContribuablePageModule {}
