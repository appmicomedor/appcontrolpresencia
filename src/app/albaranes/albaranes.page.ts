import { Component, OnInit, NgZone } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../provider/user.service';
import { AuthHttpService } from '../auth/auth-http.service';
import { UtilService } from '../provider/util.service';

@Component({
  selector: 'app-albaranes',
  templateUrl: './albaranes.page.html',
  styleUrls: ['./albaranes.page.scss'],
})
export class AlbaranesPage implements OnInit {

  getAlbaranPayload = {
    username: '',
    password: '',
    school:'',
    dbDate:'',
    code:'',
    currentDate:''
  }

  filteredArray: any = [];
  filteredArrayTemp: any = [];

  companyCode: String;
  queryDate;

  dateFmt: string;
  loading: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private zone: NgZone,
    private userService: UserService,
    private authHttpService:AuthHttpService,
    private utilService: UtilService,   
    private loadingCtrl: LoadingController,    
  ) {

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.zone.run(() => {

          if(this.router.getCurrentNavigation().extras.state.id) {

            this.authHttpService.request('GET', 'get-albaranes-for-id?id='+this.router.getCurrentNavigation().extras.state.id)
            .subscribe( res => {
              console.log(res.message);
              try {
                res.message.forEach(element => {
                  this.filteredArrayTemp.push(element);
                });

                this.filteredArray = this.filteredArrayTemp[0];
              } catch {
                this.filteredArray = [];
              }
            });
          } else {

            this.getAlbaranPayload.school = this.router.getCurrentNavigation().extras.state.school.name;
            this.getAlbaranPayload.code = this.router.getCurrentNavigation().extras.state.school.code;
            this.getAlbaranPayload.dbDate = this.router.getCurrentNavigation().extras.state.date;
            this.getAlbaranPayload.currentDate = this.router.getCurrentNavigation().extras.state.currentDate;
            this.companyCode = this.router.getCurrentNavigation().extras.state.school.code;

            if(this.getAlbaranPayload.dbDate == undefined) {
            this.queryDate = this.getAlbaranPayload.currentDate;
            this.getAlbaranPayload.dbDate = this.queryDate;
            } else {
              this.queryDate = this.getAlbaranPayload.dbDate;
            }

          this.dateFmt = this.utilService.presentDate(this.queryDate);

          this.authHttpService.request('GET','get_albaran?date='+this.queryDate+'&code='+this.getAlbaranPayload.code, this.getAlbaranPayload)
          .subscribe( res => {
            console.log(res);
            try {
              res.message.forEach(element => {
                this.filteredArray.push(element);
              });
            } catch {
              this.filteredArray = [];
            }          
          });

          }

          

        });
      }
      else{
        console.log("no");
      }
    });

   }

  ngOnInit() {
  }

  async presentLoading() {
  
    this.loading = await this.loadingCtrl.create({
      message: 'Cargando..',
      spinner: 'crescent'
    });
    return await this.loading.present();
  }  
}
