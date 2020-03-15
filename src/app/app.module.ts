import { NgModule, } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from './auth/auth.module';
import { IonicStorageModule } from '@ionic/storage';
import { UserService } from './provider/user.service';
import { environment } from '../environments/environment';
import { StudentNamePipe } from './pipes/student-name.pipe';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { DateFormatterPipe } from './pipes/date-formatter.pipe';
import { DatePipe } from '@angular/common';


@NgModule({
  declarations: [AppComponent, DateFormatterPipe],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, AuthModule, IonicStorageModule.forRoot()],
  providers: [
    StatusBar,
    DatePipe,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    UserService,
    OneSignal
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
