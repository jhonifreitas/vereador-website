import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule) },
  { path: ':url', loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule) },

  { path: 'error/404', loadChildren: () => import('./pages/error/404/404.module').then( m => m.Error404Module) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
