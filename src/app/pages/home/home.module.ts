import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// FLEX
import { FlexLayoutModule } from '@angular/flex-layout';
// MASK
import { NgxMaskModule } from 'ngx-mask';
// LOTTIE
import { LottieModule } from 'ngx-lottie';
export function playerFactory() {return import('lottie-web');}

// MATERIAL
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';

import { HomePage } from './home.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MatIconModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatExpansionModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    RouterModule.forChild([{ path: '', component: HomePage }]),
    LottieModule.forRoot({player: playerFactory, useCache: true})
  ],
  declarations: [HomePage],
})
export class HomePageModule {}