import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ManageGroupPage } from './manage-group.page';
import { StudentNamePipe } from '../pipes/student-name.pipe';

const routes: Routes = [
  {
    path: '',
    component: ManageGroupPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ManageGroupPage, StudentNamePipe],
  providers: [StudentNamePipe]
})
export class ManageGroupPageModule {}
