import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AuthHttpService } from '../auth/auth-http.service';
import { AlertController } from '@ionic/angular';
import { UserService } from '../provider/user.service';

@Component({
  selector: 'app-manage-group',
  templateUrl: './manage-group.page.html',
  styleUrls: ['./manage-group.page.scss'],
})
export class ManageGroupPage implements OnInit {

  studentList: any = [];
  displayStudentList;
  currentSchool: any;
  saveGroupPayload = {
    currentSchoolId:'',
    groupId:'',
    userName:'',
    createdAt:'',
  }

  addStudentToGroupPayload = {
    userName:'',
    groupId:'',
    studentId:'',
    createdAt:''
  }

  // all the group list
  groupList;

  // all the students who has groups
  groupStudents;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage: Storage,
    private httpService: AuthHttpService,
    private alertController: AlertController,
    private userService: UserService
  ) { 
    console.log(this.router.getCurrentNavigation().extras.state.studentList);
    console.log(this.router.getCurrentNavigation().extras.state.school.code);

    this.studentList = this.router.getCurrentNavigation().extras.state.studentList;
    this.currentSchool = this.router.getCurrentNavigation().extras.state.school;
    this.saveGroupPayload.currentSchoolId = this.router.getCurrentNavigation().extras.state.school.code;
    this.saveGroupPayload.createdAt, this.addStudentToGroupPayload.createdAt =  ''+new Date()+'';

  }

  ngOnInit() {

    this.getGroups();

    this.getGroupStudents().then( suc => {
      var arr = [];
      console.log(suc);
      this.groupStudents = suc;
      if(this.groupStudents.length === 0) {
        this.displayStudentList = this.studentList;
      } else {
        // iterate through the elements and find students that do not have groups and show that group......
        this.displayStudentList = this.studentList;
      }
      

    }).catch( err => {
      console.log(err);
    });

  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: 'Please enter a group ID.',
      buttons: ['OK']
    });

    await alert.present();
  };

  // studentListPromise = new Promise( (resolve, reject) => {
  //   if()
  // });

  getGroups(){

      this.httpService.request('GET', 'get-all-groups').subscribe( res => {
        this.groupList = res.message;
      });
  
  }

  getGroupStudents() {
    return new Promise( (resolve, reject) => {
      this.httpService.request('GET', 'get-all-group-students').subscribe( res => {
        if(res) {
          resolve(res.message);
        } else {
          reject('Error getting all stundents who has groups');
        }
      });
    });
  }
  
  newGroupCreationg() {
    console.log('hii');
    this.storage.get('user').then( data => {

      if(this.saveGroupPayload.groupId === ''){
        this.presentAlert();
      } else {
        if(data){
          console.log(data.username);
          this.saveGroupPayload.userName = data.username;
          console.log(this.saveGroupPayload);
          this.httpService.request('POST', 'save-group', this.saveGroupPayload).subscribe( res => {
            console.log(res);
            
          });
        }
      }

    });
  }

  addToGroup() {
    console.log(this.userService.getUser().username);
    this.addStudentToGroupPayload.userName = this.userService.getUser().username;
    console.log(this.addStudentToGroupPayload);

    this.httpService.request('POST', 'save-EstudianteGrupo-data', this.addStudentToGroupPayload).subscribe( res => {
      console.log(res);
    });
  }

}
