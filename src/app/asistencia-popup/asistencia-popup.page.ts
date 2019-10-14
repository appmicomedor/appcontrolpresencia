import { Component, OnInit, Input } from '@angular/core';
import { ModalController, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { CalendarComponentOptions, DayConfig } from "ion4-calendar";
import { UtilService } from '../provider/util.service';
import { AuthHttpService } from '../auth/auth-http.service';
import { UserService } from '../provider/user.service';

@Component({
  selector: 'app-asistencia-popup',
  templateUrl: './asistencia-popup.page.html',
  styleUrls: ['./asistencia-popup.page.scss'],
})
export class AsistenciaPopupPage implements OnInit {
  
  @Input() child: any;

  loadingModal: any;
  data: any;

  toast:any;

  semana: boolean = false;
  esporadico: boolean = false;
  pordias: boolean = false;
  
  dias = [
    { val: 'Lunes', isChecked: false },
    { val: 'Martes', isChecked: false },
    { val: 'Miércoles', isChecked: false },
    { val: 'Jueves', isChecked: false },
    { val: 'Viernes', isChecked: false }
  ];


  constructor(
    private modalController: ModalController,
    private loadingCtrl: LoadingController,    
    private utilService: UtilService,
    private httpService : AuthHttpService, 
    public toastCtrl: ToastController,    
    private alertCtrl: AlertController,  
    private userService: UserService,      
  ) { 
     
  
  }
 
  ngOnInit() {  
    this.getAsistencia();
  }
 
  async closeModal() {
    const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss(onClosedData);
  }

 
  accept() 
  {
    let user = this.userService.getUser();
    // Guardamos nueva asistencia
    let param = {
      userId: user.db_id,
      parentId: user.id,     
      titular: user.name, 
      childId:  this.child.id,
      y_ise_factura_aut: this.semana,
      y_ise_s: this.esporadico,
      y_ise_l: this.pordias && this.dias[0].isChecked,
      y_ise_m: this.pordias && this.dias[1].isChecked,
      y_ise_x: this.pordias && this.dias[2].isChecked,
      y_ise_j: this.pordias && this.dias[3].isChecked,
      y_ise_v: this.pordias && this.dias[4].isChecked,
    }

    this.data = null;
    this.httpService.request('POST', 'set_asistencia', param).subscribe(response => {
      if (!response['error']) {    

      }
      else {
        this.presentToast('No se ha podido modificar su cuenta bancaria, inténtelo más tarde o contacte con soporte');
      }
    });

    this.closeModal();
  }

  async presentLoading() {
  
    const loadingElement = await this.loadingCtrl.create({
      message: 'Cargando..',
      spinner: 'crescent'
    });
    return await loadingElement.present();
  }

  getAsistencia(){

    let param = {
      child_id:  this.child.id,
    }

    let $this = this;
    this.data = null;
    this.httpService.request('POST', 'get_asistencia', param).subscribe(response => {

      if (!response['error']) {    
        this.data = response['data'][0];
        this.updateRadios();
        //$this.preaviso = temp.preaviso;
      }
      else {
        //$this.preaviso = 0;
      }


    });
  }  

  updateRadios(){
    if (this.data.y_ise_factura_aut)
      this.semana = true;
    else if (this.data.y_ise_s)
      this.esporadico = true;
    else
      this.pordias = true;

    for (var d = 0; d < 5; d++) 
      this.dias[d].isChecked = false;

    if (this.data.y_ise_l)
      this.dias[0].isChecked = true;
    if (this.data.y_ise_m)
      this.dias[1].isChecked = true;
    if (this.data.y_ise_x)
      this.dias[2].isChecked = true;
    if (this.data.y_ise_j)
      this.dias[3].isChecked = true;
    if (this.data.y_ise_v)
      this.dias[4].isChecked = true;
  }

  presentToast(msg) {
    this.toast = this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'bottom'
    }).then((toastData)=>{
      toastData.present();
    });
  }

  hideToast(){
    this.toastCtrl.dismiss();
    this.toast = null;
  }  

  radioSemana($event){
    this.semana = true;
    this.esporadico = false;
    this.pordias = false;
  }
  radioEsporadico($event){
    this.semana = false;
    this.esporadico = true;
    this.pordias = false;
  }
  radioPordias($event){
    this.semana = false;
    this.esporadico = false;
    this.pordias = true;
  }    
}
 