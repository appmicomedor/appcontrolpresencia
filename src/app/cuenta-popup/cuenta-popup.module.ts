import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CuentaPopupPage } from './cuenta-popup.page';

const routes: Routes = [
  {
    path: 'cuenta',
    component: CuentaPopupPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CuentaPopupPage],
  entryComponents: [
    CuentaPopupPage
  ]
})
export class CuentaPopupPageModule {}
