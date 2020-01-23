import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'implicit/callback', loadChildren: './auth/implicit/auth-callback/auth-callback.module#AuthCallbackPageModule' },
  { path: 'implicit/logout', loadChildren: './auth/implicit/end-session/end-session.module#EndSessionPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'info', loadChildren: './info/info.module#InfoPageModule' },
  { path: 'calendar-popup', loadChildren: './calendar-popup/calendar-popup.module#CalendarPopupPageModule' },
  { path: 'asistencia-popup', loadChildren: './asistencia-popup/asistencia-popup.module#AsistenciaPopupPageModule' },
  { path: 'control', loadChildren: './control/control.module#ControlPageModule' },
  { path: 'cuenta-popup', loadChildren: './cuenta-popup/cuenta-popup.module#CuentaPopupPageModule' },
  { path: 'albaranes', loadChildren: './albaranes/albaranes.module#AlbaranesPageModule' },
  { path: 'manage-group', loadChildren: './manage-group/manage-group.module#ManageGroupPageModule' },
  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
