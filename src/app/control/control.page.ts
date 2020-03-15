import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { AuthHttpService } from '../auth/auth-http.service';
import { Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from '../provider/user.service';
import { UtilService } from '../provider/util.service';
import { StorageService } from '../auth/storage.service';

@Component({
  selector: 'app-control',
  templateUrl: './control.page.html',
  styleUrls: ['./control.page.scss'],
})
export class ControlPage implements OnInit {

  toast:any;

  school: any;
  date: Date;
  dateFmt: string;

  control: any;
  displayingControl: any = [];
  timeForSettimeOut = 1;

  groupList;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpService: AuthHttpService,
    private zone: NgZone,
    private userService: UserService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private location: Location,
    private utilService: UtilService,   
    public toastCtrl: ToastController,
    private storageService: StorageService  
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.zone.run(() => {
          this.school   = this.router.getCurrentNavigation().extras.state.school;
          this.date     = this.router.getCurrentNavigation().extras.state.date;
          this.dateFmt  = this.router.getCurrentNavigation().extras.state.dateFmt;

          this.getControl();
        });
      }
    });
  }

  studentIdWithGroup:any = [];
  studentsWithGroup:any = [];
  studentsWithoutGroup:any = [];
  studentsWithoutGroupDisplayList:any = [];

  ngOnInit() {

    console.log(this.school);

    this.getGroupForUsername().then( res => {
      this.groupList = res;      
      this.groupList.forEach(element => {
         element.show = false;
      });

      console.log(this.groupList);
      console.log(this.displayingControl);

    }).catch( err => {
      console.log(err);
      this.groupList = [];
    });

  }

  getStudentsWithoutGroup() {
    this.getAllStudentsWithGroup().then( res => {
      this.studentIdWithGroup = res;

      if(this.displayingControl.length === 0) {
        alert('ho');
        // this.timeForSettimeOut = 3;
      }

      // changed here from control to displayingcontrol
        this.studentIdWithGroup.forEach( ele => {
          this.displayingControl.forEach( el => {
            if(ele.studentId === el.id) {
              this.studentsWithGroup.push(el);
            }
          })
          console.log(ele);
        });

        // control to display control to work search
        this.studentsWithoutGroup = this.displayingControl.filter(el => {
          return this.studentsWithGroup.indexOf(el) == -1;
        });

        this.studentsWithoutGroupDisplayList = this.studentsWithoutGroup;

        console.log(this.studentsWithGroup);
        console.log(this.studentsWithoutGroup);


    }).catch(err => {
      this.studentIdWithGroup = [];
      console.log(err);
    });
  }

  getControl(){
    
    let param = {
      username: this.userService.getUser().username,
      password: this.userService.getUser().password,
      school_id: this.school.id,
      year: this.date.getFullYear(), 
      month: this.date.getMonth() + 1,
      day: this.date.getDate(),
    }

    this.httpService.request('POST', 'control-get-school', param).subscribe(response => {
    
      if (!response['error']) {   
        this.control = response['data'];

        console.log(this.control);

        // Sort by name
        this.control.sort(function (a, b) {
          let name_a = a['student_name'].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          let name_b = b['student_name'].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          if(name_a < name_b) { return -1; }
          if(name_a > name_b) { return 1; }
          return 0;
      });

        console.log(this.control);

        let dia = 'dia' + this.date.getDate();


        for (var i = 0; i < this.control.length; i++) {

          this.control[i].asistencia  = this.control[i][dia][1];
          this.control[i].nombre      = this.control[i]['student_name'];
          this.control[i].id          = this.control[i]['id'];

          this.control[i].class = 'asistencia';
          if (this.control[i].asistencia=='A' || this.control[i].asistencia=='J' || this.control[i].asistencia=='F'){
            this.control[i].class += '-' + this.control[i].asistencia;
            if (this.control[i].asistencia == 'A')
              this.control[i].code = 1;
            if (this.control[i].asistencia == 'J')
              this.control[i].code = 3;
            if (this.control[i].asistencia == 'F')
              this.control[i].code = 2;

          }

          //console.log('control ' + JSON.stringify(this.control[i]));
        }

        this.displayingControl = this.control;
        console.log(this.displayingControl);
        this.getStudentsWithoutGroup();
      }
    });
  }

  changeControl(student, index){
    if (student.asistencia=='A' || student.asistencia=='J' || student.asistencia=='F'){

      console.log('student isss');
      console.log(student);
      console.log('student isss');

      let daym = this.date.getDate();
      let dayi = 'dia' + String(daym);  
      
      if (student.code==1){
        student.code = 2;
        student.asistencia = 'F';
      }
        
      else if (student.code==2 || student.code==3){
        student.code = 1;
        student.asistencia = 'A';
      }
        
      let param = {
        username: this.userService.getUser().username,
        password: this.userService.getUser().password,
        id: student.id,
        dia: dayi,
        value: student.code,       
      }

      this.httpService.request('POST', 'control-set-day', param).subscribe(response => {

        if (!response['error']) {    
          this.updateStudent(student, index);
          this.presentToast('Cambio efectuado correctamente');
        }
        else {
          this.presentToast('ERROR: el cambio no se ha guardado, consulte con soporte');
        }
      });

    }
  }

  updateStudent(student, i){

    // this.control[i].asistencia = student.asistencia;
    // this.control[i].code = student.code;
    // this.control[i].class = 'asistencia';
    // if (this.control[i].asistencia=='A' || this.control[i].asistencia=='J' || this.control[i].asistencia=='F'){
    //   this.control[i].class += '-' + this.control[i].asistencia + '  md hydrated';
    // }

    this.displayingControl[i].asistencia = student.asistencia;
    this.displayingControl[i].code = student.code;
    this.displayingControl[i].class = 'asistencia';
    if (this.displayingControl[i].asistencia=='A' || this.displayingControl[i].asistencia=='J' || this.displayingControl[i].asistencia=='F'){
      this.displayingControl[i].class += '-' + this.displayingControl[i].asistencia + '  md hydrated';
    }

  }

  goBack(){
    this.location.back();
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

  hideToast(){
    this.toastCtrl.dismiss();
    this.toast = null;
  }  

  searchFunc(event) {
    if(event.length == 0) {
      this.displayingControl = this.control;
      this.studentsWithoutGroupDisplayList = this.studentsWithoutGroup;
      this.displayStudentListForClickedGroupNew = this.studentListForClickedGroupNew;
      // this.getControl();
    } else {
      let newArr = this.control.filter( (student) => {
        return student.student_name.toLowerCase().includes(event.toLowerCase());
      } );
      console.log(newArr);
      this.displayingControl = newArr;

      // search for students without group
      let newArrStudentsWithoutGroup = this.studentsWithoutGroup.filter( (student) => {
        return student.student_name.toLowerCase().includes(event.toLowerCase());
      } );
      console.log(newArrStudentsWithoutGroup);
      this.studentsWithoutGroupDisplayList = newArrStudentsWithoutGroup;

      // search for studentListForClickedGroupNew
      let newArrStudentListForClickedGroupNew = this.studentListForClickedGroupNew.filter( (student) => {
        return student.student_name.toLowerCase().includes(event.toLowerCase());
      } );
      console.log(newArrStudentsWithoutGroup);
      this.displayStudentListForClickedGroupNew = newArrStudentListForClickedGroupNew;

    }
    
  }

  gotoManageGroupPage() {
    let navigationExtras: NavigationExtras = {
      state: {
        studentList: this.displayingControl,
        school: this.school
      }
    };
    this.router.navigate(['manage-group'], navigationExtras);
  }

  getGroups(){

    return new Promise( (resolve, reject) => {
      this.httpService.request('GET', 'get-all-groups').subscribe( res => {
        if(res) {
          resolve(res.message);
        } else {
          reject('error getting groups');
        }
      });
    })
  
  }

  getGroupForUsername(){

    return new Promise( (resolve, reject) => {
      this.storageService.getItem('user').then( res => {
        this.httpService.request('GET', 'get-group-for-username?username='+res['username']+'&schoolId='+this.school.code).subscribe( res => {
          if(res) {
            resolve(res.message);
          } else {
            reject('error getting groups');
          }
        });
      }).catch( err => {
        console.log(err);
      });
    })
  
  }

  studentListForClickedGroup:any = [];
  studentListForClickedGroupNew = [];
  displayStudentListForClickedGroupNew = [];

  rowClick(index, groupid) {
    this.groupList[index].show = !this.groupList[index].show;
    this.groupList.forEach( (element, ind) => {
      if(ind !== index) {
        element.show = false;
      }
    });

    if(this.groupList[index].show === true) {
      this.studentListForClickedGroupNew = [];
      this.getAllStudentIdsForGroupId(groupid).then( res => {
        this.studentListForClickedGroup = res;
        console.log(this.studentListForClickedGroup);
        
        this.displayingControl.forEach(element => {
          this.studentListForClickedGroup.forEach( ele => {
            if(element.id === ele.studentId) {
              this.studentListForClickedGroupNew.push(element);
            }
          });
          console.log(element);
        });

        console.log(this.studentListForClickedGroupNew);
        this.displayStudentListForClickedGroupNew = this.studentListForClickedGroupNew;
      }).catch( err => {
        console.log(err);
      });
    }
  }

  getAllStudentIdsForGroupId(groupid) {
    return new Promise( (resolve, reject) => {
      this.httpService.request('GET', 'get-studentIds-for-groupId?gid='+groupid).subscribe( res => {
        if(res) {
          resolve(res.message);
        } else {
          reject('no data recieved from get-studentIds-for-groupId');
        }
      })
    });
  }

  getAllStudentsWithGroup() {
    return new Promise( (resolve, reject) => {
      this.httpService.request('GET', 'get-all-group-students').subscribe( res => {
        if(res) {
          resolve(res.message);
        } else {
          reject('Error getting all students with group');
        }
      });
    });
  }

  ionViewWillEnter() {
    // alert('check');
    this.ngOnInit();
  }

}
