import { Component, OnInit } from '@angular/core';
import { UserService } from '../provider/user.service';
import { AuthHttpService } from '../auth/auth-http.service';
import { ToastController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-upload-view',
  templateUrl: './upload-view.page.html',
  styleUrls: ['./upload-view.page.scss'],
})
export class UploadViewPage implements OnInit {

  constructor(private httpService: AuthHttpService, 
    private userService: UserService, 
    public toastCtrl: ToastController,
    private datePipe: DatePipe,
    private router: Router) {
      // this.ngxdataTable.messages.totalMessage="";
     }

  jsonData = [
    {
      "name": "Ethel Price",
      "gender": "female",
      "company": "Johnson, Johnson and Partners, LLC CMP DDC",
      "age": 22
    },
    {
      "name": "Claudine Neal",
      "gender": "female",
      "company": "Sealoud",
      "age": 55
    },
    {
      "name": "Beryl Rice",
      "gender": "female",
      "company": "Velity",
      "age": 67
    },
    {
      "name": "Wilder Gonzales",
      "gender": "male",
      "company": "Geekko"
    }];

    tableData: any = [];

  ngOnInit() {

    this.httpService.request('GET','get-all-albaranes-list').subscribe( res => {
      //console.log(res);
      this.tableData = res.message.map( mes => {

        mes.date = mes.date.split('T')[0];

        if (mes.fechaelaboracion)
          mes.fechaelaboracion = this.datePipe.transform(mes.fechaelaboracion.split('T')[0],'dd-MM-yyyy');

        mes.fechaconsumo = this.datePipe.transform(mes.date.split('T')[0],'dd-MM-yyyy');
        return mes;
      });
      // console.log(td);

      // this.tableData = res.message;

    });

  }

  uploadPayload = {
    fileName:'',
    readerFile:undefined,
    password: '',
    username: '',
  };

  readerResult;
  toast:any;

  btnClickSam() {
    this.uploadPayload.username = this.userService.getUser().username;
    this.uploadPayload.password = this.userService.getUser().password;

    if(this.uploadPayload.readerFile === undefined) {
      alert('nooo');
    } else {
      this.uploadSubmit(this.uploadPayload);
    }
  }

  fileUploading($event) {
    // console.log($event.target.files[0]);
    const file: File = $event.target.files[0];
    console.log(file);
    const fileName: string = file.name;

    const myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      console.log('inside reader result');
      this.readerResult = myReader.result;
      this.uploadPayload.fileName = fileName;
      this.uploadPayload.readerFile = myReader.result;
      // console.log(this.readerResult);
      // this.invoiceDetails.poFiles = myReader.result;
      

    };

      myReader.readAsDataURL(file);
      // this.uploadPayload.readerFile = this.readerResult;

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
  
  async open(row) {
    console.log(row);
  }

  onUserEvent(e) {
    if ( e.type == "click" ) {
      console.log(e.row);
      this.navigateToAlbaranes(e.row.id);
    }
  }

  navigateToAlbaranes(id){
    console.log(id);
    let navigationExtras: NavigationExtras = {
      state: {
        id:id
      }
    };
    this.router.navigate(['albaranes'], navigationExtras);
  }

  compareDates(a, b): number {
    if (a==null || a==''){
      if (b==null || b==''){
        return 0;
      }
      else {
        return -1;
      }
    }
    if (b==null || b==''){
      return 1;
    }
    var a3 = a.split('-');
    var b3 = b.split('-');
    var da = new Date(a3[2], a3[1]-1, a3[0]).getTime();
    var db = new Date(b3[2], b3[1]-1, b3[0]).getTime();
    console.log('sorting reviewed');
    console.log(a + ' ' + da);
    console.log(b + ' ' + db);
    if(da > db){
      console.log('1');
      return 1;
    } else if(da < db){
      console.log('-1');
      return -1;
    } else {
      console.log('0');

      return 0;
    }
  }

}
