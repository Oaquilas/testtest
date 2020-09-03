import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChoixEquipementsPageRoutingModule } from './choix-equipements-routing.module';

import { ChoixEquipementsPage } from './choix-equipements.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChoixEquipementsPageRoutingModule
  ],
  declarations: [ChoixEquipementsPage]
})
export class ChoixEquipementsPageModule {}
