import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AuthHttpService } from '../auth/auth-http.service';
import { AlertController } from '@ionic/angular';
import { UserService } from '../provider/user.service';
import { StudentNamePipe } from '../pipes/student-name.pipe';
import { element } from 'protractor';
import { StorageService } from '../auth/storage.service';

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
    groupName:'',
    userName:'',
    createdAt:'',
  }

  addStudentToGroupPayload = {
    userName:'',
    groupId:'',
    students:[],
    createdAt:'',
    schoolId:''
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
    private userService: UserService,
    private studentPipe: StudentNamePipe,
    private storageService: StorageService
  ) { 

    this.studentList = this.router.getCurrentNavigation().extras.state.studentList;
    this.currentSchool = this.router.getCurrentNavigation().extras.state.school;
    this.saveGroupPayload.currentSchoolId = this.router.getCurrentNavigation().extras.state.school.code;
    this.saveGroupPayload.createdAt, this.addStudentToGroupPayload.createdAt =  ''+new Date()+'';

  }

  ngOnInit() {


  }

  doRefresh(event) {
    this.getGroups(); 
    event.target.complete();
  }

  ionViewDidEnter() {  
    this.getGroups();
  }

  async getGroups() {

    // this.getGroupForUsername();
    let $this = this;

    await this.getGroupForUsername().then( res => {

      $this.groupList = res;      
      $this.groupList.forEach(element => {
         element.show = false;
      });

    }).catch( err => {
      console.log(err);
      $this.groupList = [];
    });

    await this.getGroupStudents().then( suc => {
      var arr = [];

      $this.groupStudents = suc;
      if($this.groupStudents.length === 0) {
        $this.displayStudentList = $this.studentList;
      } else {
        // iterate through the elements and find students that do not have groups and show that group......
        $this.displayStudentList = $this.studentList;
        $this.studentList.forEach(elem1 => {
          $this.groupStudents.forEach(elem2 => {
            if(elem1.id === elem2.studentId) {
              $this.studensWithGroupList.push(elem1);
            }
          });
        });
        
        $this.studentsWithoutGroupList = $this.studentList.filter( (ele) => {
          return !$this.studensWithGroupList.includes(ele);
        });

        $this.displayStudentList = $this.studentsWithoutGroupList;

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
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('cancel');
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

            if(alertData.name1 === '') {
              this.presentAlert();
            } else {
              this.saveGroupPayload.groupName = alertData.name1;
              this.newGroupCreation();
            }
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('cancel');
          }
        }  
      ]
    });

    await alert.present();
  };

  createBtnClick(groupId) {
    this.addStudentAlertNew(groupId);
  }

  async addStudentAlertNew(groupId) {

    let input = {data:[]};

    if(this.groupStudents.length === 0) {
      this.studentList.forEach( (element, j) => {
        input.data.push({name:"checkbox"+(j+input.data.length),type: 'checkbox',label:this.studentPipe.transform(element.id, this.studentList),value: '{"type":"unchecked","studentId":"'+element.id+'"}'})
      });
    } else {

        // filter the student who is in the given groupId
        let filteredGroupIdStudents = this.groupStudents.filter( ele => {
          return ele.groupId === groupId;
        });

        filteredGroupIdStudents.forEach( (elem, i) => {
          input.data.push({name:"checkbox"+i,type: 'checkbox',label:this.studentPipe.transform(elem.studentId, this.studentList),value: '{"type":"checked","studentId":"'+elem.studentId+'"}',checked:true});
        });

        // getting the common student from studentList
        let studentsWithGroup = [];
        this.studentList.forEach(element1 => {
          this.groupStudents.forEach(element2 => {
            if(element1.id === element2.studentId) {
              studentsWithGroup.push(element1);
            }
          });
        });

        // getting teh students without a group
        let studentsWithoutGroupList = this.studentList.filter(el => {
          return studentsWithGroup.indexOf(el) == -1;
        });

        studentsWithoutGroupList.forEach( (eleme, j) => {
          input.data.push({name:"checkbox"+(j+input.data.length),type: 'checkbox',label:this.studentPipe.transform(eleme.id, this.studentList),value: '{"type":"unchecked","studentId":"'+eleme.id+'"}'})
        });
    }
    
    const alert = await this.alertController.create({
      header: 'Seleccionar estudiantes',
      inputs: input.data,
      message: 'Marca o desmarca estudiantes para añadir o eliminar del grupo.',
      buttons: [
        {
          text: 'Ok',
          handler: (alertData) => {
            let newStudents:any = [];

            alertData.forEach(element => {
              newStudents.push(JSON.parse(element).studentId);
            });

            this.updateGroup(groupId, newStudents);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('cancel');
          }
        }  
      ]
    });

    await alert.present();
  };
  

  getGroupForUsername(){

    return new Promise( (resolve, reject) => {
      this.httpService.request('GET', 'get-groups?username='+this.userService.getUser().username+'&schoolId='+this.currentSchool.code).subscribe( res => {
        if(res) {
          resolve(res.message);
        } else {
          reject('error getting groups');
        }
      });
    })
  
  }

  getGroupStudents() {
    return new Promise( (resolve, reject) => {
      this.httpService.request('GET', 'get-students?username='+this.userService.getUser().username+'&schoolId='+this.currentSchool.code).subscribe( res => {
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
  
  newGroupCreation() {
    let $this = this;

    if($this.saveGroupPayload.groupName === ''){
      $this.presentAlert();
    } else {

      $this.saveGroupPayload.createdAt =  ''+new Date()+'';
      $this.saveGroupPayload.userName = this.userService.getUser().username;
      $this.httpService.request('POST', 'save-group', $this.saveGroupPayload).subscribe( res => {
        $this.getGroups();
      });
    
    }
  }

  clearAddStudentToGroupPayload() {
    this.addStudentToGroupPayload.userName = '';
    this.addStudentToGroupPayload.groupId = null;
    this.addStudentToGroupPayload.students = [];
    this.addStudentToGroupPayload.createdAt = '';
    
  }

  updateGroup(groupId, newStudents) {

    this.addStudentToGroupPayload.groupId = groupId;
    this.addStudentToGroupPayload.students = newStudents;
    this.addStudentToGroupPayload.userName = this.userService.getUser().username;
    this.addStudentToGroupPayload.createdAt =  ''+new Date()+'';
    this.addStudentToGroupPayload.schoolId = this.currentSchool.code;

    this.httpService.request('POST', 'update-group', this.addStudentToGroupPayload).subscribe( res => {
      this.getGroups();
      this.clearAddStudentToGroupPayload();
    });
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

  deleteGroupBtn(groupId, groupName) {
    this.deleteGroupAlert(groupId, groupName);
  }


  async deleteGroupAlert(groupId, groupName) {
    const alert = await this.alertController.create({
      header: 'Borrar grupo',
      message: 'Estás seguro que quieres eliminar el grupo '+groupName+' ?',
      buttons: [
        {
          text: 'Ok',
          handler: (alertData) => {
            let groupDeletePayload = {groupId: groupId}
            let $this = this;
            this.httpService.request('POST','delete-group-and-students-in-it', groupDeletePayload).subscribe( res => {
              $this.getGroups();
            });
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: (alertData) => {
            console.log('cancel');
          }
        }
      ]
    });

    await alert.present();
  };

  studentListForClickedGroup:any = [];
  rowClick(index, groupid) {
    this.groupList[index].show = !this.groupList[index].show;
    this.groupList.forEach( (element, ind) => {
      if(ind !== index) {
        element.show = false;
      }
    });

    if(this.groupList[index].show === true) {
      this.getAllStudentIdsForGroupId(groupid).then( res => {
        this.studentListForClickedGroup = res;
      }).catch( err => {
        console.log(err);
      });
    }
  }

}
