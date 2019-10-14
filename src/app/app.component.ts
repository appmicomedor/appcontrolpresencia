import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AuthService } from './auth/auth.service';
import { UserService } from './provider/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    public storage: Storage,
    public userService: UserService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.authService.startUpAsync();
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.storage.get('user').then((data) => {
        if (data) {
          this.userService.setUser(data);
        }
      });
    });
  }
}
