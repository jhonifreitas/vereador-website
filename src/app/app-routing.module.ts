import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: ':vereador', loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule) },
  { path: '**', loadChildren: () => import('./pages/error/404/404.module').then( m => m.Error404Module) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
