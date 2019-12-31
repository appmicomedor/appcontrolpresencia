import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { AuthHttpService } from '../auth/auth-http.service';
import { Router, NavigationExtras } from '@angular/router';
import { UserService } from '../provider/user.service';
import { UtilService } from '../provider/util.service';
import { CalendarPopupPage } from '../calendar-popup/calendar-popup.page'

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  user: any;
  app_version: string;

  date: Date;
  dateFmt: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpService: AuthHttpService,
    private zone: NgZone,
    private userService: UserService,
    private utilService: UtilService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
  ) {
    this.date = new Date();
    this.dateFmt = this.utilService.presentDate(this.date);

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.zone.run(() => {
          this.user = this.router.getCurrentNavigation().extras.state.user;
        });
      }
      else{
        this.user = this.userService.getUser();
      }
    });
  }


  ngOnInit() {
    this.app_version = '1.0.3';
  }

  async cerrarSesion(){
    const alert = await this.alertCtrl.create({
      subHeader: 'Cierre de sesión',
      message: '¿Está seguro que quiere cerrar la sesión?',
      buttons: [
        {
          text: 'Sí',
          handler: () => {
            this.logout();
          }
        },
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
          }
        }
      ],
    });
    alert.present();
  }  
  logout() {
    this.userService.saveUser(null);
    this.router.navigateByUrl('/');
  }

  async openCalendar(){
    const modal = await this.modalCtrl.create({
      component: CalendarPopupPage,
      componentProps: {

      }
    });
 
    modal.onDidDismiss().then((data) => {
      if (data && data.data) {
        this.date = new Date(data.data);
        this.dateFmt = this.utilService.presentDate(this.date);
      }
    });
 
    return await modal.present();
  }

  openSchool(school){
    let navigationExtras: NavigationExtras = {
      state: {
        school: school,
        date: this.date,
        dateFmt: this.dateFmt
      }
    };
    this.router.navigate(['control'], navigationExtras);
  }

  openGroups(school){
    /*let navigationExtras: NavigationExtras = {
      state: {
        school: school,
        date: this.date,
        dateFmt: this.dateFmt
      }
    };
    this.router.navigate(['groups'], navigationExtras);   */ 
  }
}
