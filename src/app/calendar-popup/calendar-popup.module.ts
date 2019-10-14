import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CalendarPopupPage } from './calendar-popup.page';
import { CalendarModule } from "ion4-calendar";

const routes: Routes = [
  {
    path: 'calendar',
    component: CalendarPopupPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    CalendarModule
  ],
  declarations: [CalendarPopupPage],
  entryComponents: [
    CalendarPopupPage
  ]
})
export class CalendarPopupPageModule {}
