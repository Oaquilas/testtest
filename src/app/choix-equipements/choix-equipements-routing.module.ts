import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChoixEquipementsPage } from './choix-equipements.page';

const routes: Routes = [
  {
    path: '',
    component: ChoixEquipementsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChoixEquipementsPageRoutingModule {}
