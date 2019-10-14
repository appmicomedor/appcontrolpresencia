import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AsistenciaPopupPage } from './asistencia-popup.page';

const routes: Routes = [
  {
    path: 'asistencia',
    component: AsistenciaPopupPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AsistenciaPopupPage],
  entryComponents: [
    AsistenciaPopupPage
  ]
})
export class AsistenciaPopupPageModule {}
