import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { AuthHttpService } from '../auth/auth-http.service';
import { Router, NavigationExtras } from '@angular/router';
import { UserService } from '../provider/user.service';
import { UtilService } from '../provider/util.service';
import { CalendarPopupPage } from '../calendar-popup/calendar-popup.page'
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  toast:any;

  user: any;
  app_version: string;

  date: Date;
  currentDate;
  dbDate;
  dateFmt: string;
  uploadForm: FormGroup; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpService: AuthHttpService,
    private zone: NgZone,
    private userService: UserService,
    private utilService: UtilService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    public toastCtrl: ToastController,        
  ) {

    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });

    this.date = new Date();
    this.currentDate = this.formatDate(this.date);
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
    this.app_version = '1.0.4';
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
      console.log(data);
      if (data && data.data) {
        this.date = new Date(data.data);
        this.dbDate = this.formatDate(data.data);
        this.dateFmt = this.utilService.presentDate(this.date);
      }
    });
 
    return await modal.present();
  }

  openSchool(school){
    console.log(school);
    let navigationExtras: NavigationExtras = {
      state: {
        school: school,
        date: this.date,
        dateFmt: this.dateFmt
      }
    };
    this.router.navigate(['control'], navigationExtras);
  }

  gotoAlbaranes(school, date) {
    console.log(school);
    let navigationExtras: NavigationExtras = {
      state: {
        school: school,
        date: date,
        currentDate: this.currentDate
      }
    };
    this.router.navigate(['albaranes'], navigationExtras);
  }

  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
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

  readerResult;

  uploadPayload = {
    readerFile:undefined,
    password: '',
    username: '',
  };

  fileUploading($event) {
    // console.log($event.target.files[0]);
    const file: File = $event.target.files[0];


    const myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      console.log('inside reader result');
      this.readerResult = myReader.result;
      this.uploadPayload.readerFile = myReader.result;
      // console.log(this.readerResult);
      // this.invoiceDetails.poFiles = myReader.result;
      

    };

      myReader.readAsDataURL(file);
      // this.uploadPayload.readerFile = this.readerResult;

  }

  btnClickSam() {
    this.uploadPayload.username = this.userService.getUser().username;
    this.uploadPayload.password = this.userService.getUser().password;

    this.uploadSubmit(this.uploadPayload);
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get('profile').setValue(file);
    }
  }

  uploadSubmit(params) {
    // const formData = new FormData();
    // formData.append('file', this.uploadForm.get('profile').value);

    this.httpService.request('POST', 'save_albaran', params).subscribe( response => {
      if (!response['error']) { 
        this.presentToast('Fichero subido correctamente');
      }
      else {
        this.presentToast('ERROR subida del fichero: '+ response['error'].sqlMessage);
      }
    });
  }

  presentToast(msg) {
    this.toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    }).then((toastData)=>{
      toastData.present();
    });
  }  

}
