import { Component, OnInit, Input } from '@angular/core';
import { ModalController, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { CalendarComponentOptions, DayConfig } from "ion4-calendar";
import { UtilService } from '../provider/util.service';
import { AuthHttpService } from '../auth/auth-http.service';
import { UserService } from '../provider/user.service';

@Component({
  selector: 'app-calendar-popup',
  templateUrl: './calendar-popup.page.html',
  styleUrls: ['./calendar-popup.page.scss'],
})
export class CalendarPopupPage implements OnInit {
  
  loadingModal: any;

  date: Date;
  type: 'string';  
  dateFmt: string;
  dateYMD: string;

  daysConfig: DayConfig[];
  data: any;

  optionsRange: CalendarComponentOptions = {
      from: new Date(),
      to: new Date(),
      pickMode: 'single',
      showMonthPicker: true,
      monthPickerFormat: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      weekdays: ['Domin', 'Lun', 'Mar', 'Mié', 'Jue', 'Viernes', 'Sáb'],
      weekStart: 1,
      daysConfig: []
  };

  constructor(
    private modalController: ModalController,
    private utilService: UtilService,
    public toastCtrl: ToastController,        
  ) { 
    this.date = new Date();
    this.dateYMD = this.utilService.formatYMD(this.date);
    this.dateFmt = this.utilService.presentDate(this.date);

    this.daysConfig = [];   
     
    var b = new Date();
    b.setDate(b.getDate() - 80); // Hace 80 días
    this.optionsRange.from = b;
  
  }
 
  ngOnInit() {  

  }
 
  async closeModal() {
    await this.modalController.dismiss();
  }

  async onChange($event) 
  {
    this.date = new Date(this.dateYMD);
    this.date.setHours(14);
    
    this.dateFmt = this.utilService.presentDate(this.date);

    await this.modalController.dismiss(this.date);
  }
}
 