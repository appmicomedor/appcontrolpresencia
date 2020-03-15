import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    groupId:'',
    userName:'',
    createdAt:'',
  }

  addStudentToGroupPayload = {
    userName:'',
    groupId:'',
    studentIdToAdd:[],
    studentIdToRemove:[],
    createdAt:'',
    school:''
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
    private studentPipe: StudentNamePipe,
    private storageService: StorageService
  ) { 
    console.log(this.router.getCurrentNavigation().extras.state.studentList);
    console.log(this.router.getCurrentNavigation().extras.state.school.code);

    this.studentList = this.router.getCurrentNavigation().extras.state.studentList;
    this.currentSchool = this.router.getCurrentNavigation().extras.state.school;
    this.saveGroupPayload.currentSchoolId = this.router.getCurrentNavigation().extras.state.school.code;
    this.saveGroupPayload.createdAt, this.addStudentToGroupPayload.createdAt =  ''+new Date()+'';

    console.log(this.currentSchool.code);
  }

  ngOnInit() {

    // this.getGroupForUsername();

    this.getGroupForUsername().then( res => {
      console.log('ooooooo');
      console.log(res);
      console.log('ooooooo');

      this.groupList = res;      
      this.groupList.forEach(element => {
         element.show = false;
      });

    }).catch( err => {
      console.log(err);
      this.groupList = [];
    });

    console.log(this.groupList);
    this.groupAndStudentList = [];

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
          console.log(suc);
    
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
              this.ngOnInit();
            }
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
        console.log(element);
        input.data.push({name:"checkbox"+(j+input.data.length),type: 'checkbox',label:this.studentPipe.transform(element.id, this.studentList),value: '{"type":"unchecked","studentId":"'+element.id+'"}'})
      });
    } else {

        // filter the student who is in the given groupId
        let filteredGroupIdStudents = this.groupStudents.filter( ele => {
          return ele.groupId === groupId;
        });

        filteredGroupIdStudents.forEach( (elem, i) => {
          console.log(elem.studentId);
          console.log(this.studentPipe.transform(elem.studentId, this.studentList));
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
      header: 'Create Group',
      inputs: input.data,
      message: 'Marca o desmarca estudiantes para añadir o eliminar del grupo.',
      buttons: [
        {
          text: 'Ok',
          handler: (alertData) => {
            let studentIdToAddGroup:any = [];
            let studentIdToRemoveGroup:any = [];
            console.log(alertData);
            alertData.forEach(element => {
              if(JSON.parse(element).type === "unchecked") {
                studentIdToAddGroup.push(JSON.parse(element).studentId);
              }

              if(JSON.parse(element).type === "checked") {
                studentIdToRemoveGroup.push(JSON.parse(element).studentId);
              }
            });

            this.addToGroup(groupId, studentIdToAddGroup, []);
            console.log(studentIdToAddGroup);
            console.log(studentIdToRemoveGroup);

          }
        }
      ]
    });

    await alert.present();
  };

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
        console.log('ppppppppppp');
        console.log(res);
        console.log('ppppppppppp');
        this.httpService.request('GET', 'get-group-for-username?username='+res['username']+'&schoolId='+this.currentSchool.code).subscribe( res => {
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
            this.ngOnInit();
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
    this.addStudentToGroupPayload.school = this.currentSchool.code;

    console.log(this.addStudentToGroupPayload);

    this.httpService.request('POST', 'save-EstudianteGrupo-data', this.addStudentToGroupPayload).subscribe( res => {
      console.log(res);
      this.ngOnInit();
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

  deleteGroupBtn(groupId) {
    this.deleteGroupAlert(groupId);
  }


  async deleteGroupAlert(groupId) {
    const alert = await this.alertController.create({
      header: 'Borrar grupo',
      message: 'Estás seguro que quieres eliminar el grupo '+groupId+' ?',
      buttons: [
        {
          text: 'Ok',
          handler: (alertData) => {
            console.log(groupId);
            let groupDeletePayload = {groupId: groupId}
            this.httpService.request('POST','delete-group-and-students-in-it', groupDeletePayload).subscribe( res => {
              console.log(res);
              this.ngOnInit();
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

  somefunc() {
    console.log('hi');
  }

}
