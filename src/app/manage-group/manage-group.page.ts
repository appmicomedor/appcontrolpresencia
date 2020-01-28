import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AuthHttpService } from '../auth/auth-http.service';
import { AlertController } from '@ionic/angular';
import { UserService } from '../provider/user.service';
import { StudentNamePipe } from '../pipes/student-name.pipe';

@Component({
  selector: 'app-manage-group',
  templateUrl: './manage-group.page.html',
  styleUrls: ['./manage-group.page.scss'],
})
export class ManageGroupPage implements OnInit {

  studentList: any = [];
  studensWithGroupList: any = [];
  studentsWithoutGroupList:any = [];
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
    studentIdToAdd:[],
    studentIdToRemove:[],
    createdAt:''
  }

  removeStudentFromGroupPayload = {
    userName:'',
    groupId:'',
    studentId:'',
    createdAt:''
  }

  // all the group list
  groupList;

  // all the students who has groups
  groupStudents;

  distinctGroupId:any = [];

  groupAndStudentList = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage: Storage,
    private httpService: AuthHttpService,
    private alertController: AlertController,
    private userService: UserService,
    private studentPipe: StudentNamePipe
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
        this.studentList.forEach(elem1 => {
          this.groupStudents.forEach(elem2 => {
            if(elem1.id === elem2.studentId) {
              this.studensWithGroupList.push(elem1);
            }
          });
        });

        console.log(this.studensWithGroupList);
        
        this.studentsWithoutGroupList = this.studentList.filter( (ele) => {
          return !this.studensWithGroupList.includes(ele);
        });

        this.displayStudentList = this.studentsWithoutGroupList;

        this.getAllDistinctGroupIds().then( suc => {
          this.distinctGroupId = suc;
    
          this.distinctGroupId.forEach(gpid => {
            let test = {
              groupId:gpid.groupId,
              gpSt: []
            }
            this.groupStudents.forEach(st => {
              if(st.groupId === gpid.groupId){
                test.gpSt.push(st);
              }
            });
            this.groupAndStudentList.push(test);
          });
          console.log(this.groupAndStudentList);
        }).catch( err => {
          console.log(err);
        });

      }
      

    }).catch( err => {
      console.log(err);
    });

  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Atención',
      message: 'Por favor, introduce un nombre del grupo',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.createGroupAlert();
          }
        }
      ]
    });

    await alert.present();
  };

  async createGroupAlert() {
    const alert = await this.alertController.create({
      header: 'Crear grupo',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: 'Introducir nombre del grupo'
        }
      ],
      message: 'Introducir nombre del grupo.',
      buttons: [
        {
          text: 'Ok',
          handler: (alertData) => {
            console.log(alertData.name1);
            if(alertData.name1 === '') {
              this.presentAlert();
            } else {
              this.saveGroupPayload.groupId = alertData.name1;
              this.newGroupCreationg();
            }
          }
        }
      ]
    });

    await alert.present();
  };

  createBtnClick(groupId) {
    this.addStudentAlert(groupId);
  }

  async addStudentAlert(groupId) {
    let input = {data:[]};
    let newArr = this.groupAndStudentList.filter( (arrElem) => {
      return arrElem.groupId === groupId;
    });
    let desiredArr = newArr[0].gpSt;

    desiredArr.forEach( (element, i) => {
      input.data.push({name:"checkbox"+i,type: 'checkbox',label:this.studentPipe.transform(element.studentId, this.studentList),value: '{"type":"checked","studentId":"'+element.studentId+'"}',checked:true})
    });

    this,this.studentsWithoutGroupList.forEach( (elem, j) => {
      input.data.push({name:"checkbox"+(j+input.data.length),type: 'checkbox',label:this.studentPipe.transform(elem.id, this.studentList),value: '{"type":"unchecked","studentId":"'+elem.id+'"}'})
      // console.log(elem);
    })

    console.log(newArr);
    const alert = await this.alertController.create({
      header: 'Create Group',
      inputs: input.data,
      message: 'Select/unselect students to add/remove.',
      buttons: [
        {
          text: 'Ok',
          handler: (alertData) => {
            console.log(alertData.name1);
            if(alertData.name1 === '') {
              this.presentAlert();
            } else {
              let studentIdToAddGroup:any = [];
              let studentIdToRemoveGroup:any = [];
              // console.log(alertData);
              alertData.forEach(element => {
                console.log(JSON.parse(element));
                // console.log(element);
                if(JSON.parse(element).type === "unchecked") {
                  studentIdToAddGroup.push(JSON.parse(element).studentId);
                }

                if(JSON.parse(element).type === "checked") {
                  studentIdToRemoveGroup.push(JSON.parse(element).studentId);
                }
                
              });
              console.log(studentIdToRemoveGroup);
              console.log(desiredArr);
              let realStToRemove = desiredArr.filter( ele => {
                console.log(ele.studentId);
                return studentIdToRemoveGroup.includes(String(ele.studentId));
              });
              console.log(realStToRemove);
              this.addToGroup(groupId, studentIdToAddGroup, studentIdToRemoveGroup);
              
            }
          }
        }
      ]
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

  newGroupPopUp() {
    this.createGroupAlert();
  }
  
  newGroupCreationg() {
    console.log('hii');
    this.storage.get('user').then( data => {

      if(this.saveGroupPayload.groupId === ''){
        this.presentAlert();
      } else {
        if(data){
          this.saveGroupPayload.createdAt =  ''+new Date()+'';
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

  clearAddStudentToGroupPayload() {
    this.addStudentToGroupPayload.userName = '';
    this.addStudentToGroupPayload.groupId = '';
    this.addStudentToGroupPayload.studentIdToAdd = [];
    this.addStudentToGroupPayload.studentIdToRemove = [];
    this.addStudentToGroupPayload.createdAt = '';
    
  }

  addToGroup(groupId, studentIdToAdd, studentIdToRemove) {
    console.log(groupId);
    console.log(studentIdToAdd);
    this.addStudentToGroupPayload.groupId = groupId;
    this.addStudentToGroupPayload.studentIdToAdd = studentIdToAdd;
    this.addStudentToGroupPayload.studentIdToRemove = studentIdToRemove;
    console.log(this.userService.getUser().username);
    this.addStudentToGroupPayload.userName = this.userService.getUser().username;
    this.addStudentToGroupPayload.createdAt =  ''+new Date()+'';

    console.log(this.addStudentToGroupPayload);

    this.httpService.request('POST', 'save-EstudianteGrupo-data', this.addStudentToGroupPayload).subscribe( res => {
      console.log(res);
      // this.ngOnInit();
      this.clearAddStudentToGroupPayload();
    });
  }

  removeStudentSelect() {
    console.log(this.removeStudentFromGroupPayload.studentId);
    // this.studentList.
  }

  getAllDistinctGroupIds() {
    return new Promise( (resolve, reject) => {
      this.httpService.request('GET', 'get-distinct-groupId').subscribe( res => {
        if(res) {
          resolve(res.message);
        } else {
          reject('no data recieved from get-distinct-groupId');
        }
      })
    });
  }

}
