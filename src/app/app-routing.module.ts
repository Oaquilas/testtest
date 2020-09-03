import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'home', 
  loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  
  {
    path: 'intro',
    loadChildren: () => import('./intro/intro.module').then( m => m.IntroPageModule)
  },
  {
    path: 'enrollement',
    loadChildren: () => import('./enrollement/enrollement.module').then( m => m.EnrollementPageModule)
  },
  {
    path: 'choix-equipements',
    loadChildren: () => import('./choix-equipements/choix-equipements.module').then( m => m.ChoixEquipementsPageModule)
  },
  {
    path: 'contribsearch',
    loadChildren: () => import('./contribsearch/contribsearch.module').then( m => m.ContribsearchPageModule)
  },
  {
    path: 'contribdetail/:id',
    loadChildren: () => import('./contribdetail/contribdetail.module').then( m => m.ContribdetailPageModule)
  },
  {
    path: 'orange-modal',
    loadChildren: () => import('./orange-modal/orange-modal.module').then( m => m.OrangeModalPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'eticketing',
    loadChildren: () => import('./eticketing/eticketing.module').then( m => m.EticketingPageModule)
  },
  {
    path: 'agentmodal',
    loadChildren: () => import('./agentmodal/agentmodal.module').then( m => m.AgentmodalPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
