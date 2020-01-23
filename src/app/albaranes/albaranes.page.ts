import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../provider/user.service';
import { AuthHttpService } from '../auth/auth-http.service';

@Component({
  selector: 'app-albaranes',
  templateUrl: './albaranes.page.html',
  styleUrls: ['./albaranes.page.scss'],
})
export class AlbaranesPage implements OnInit {

  getAlbaranPayload = {
    school:'',
    dbDate:'',
    code:'',
    currentDate:''
  }

  filteredArray: any = [];

  companyCode: String;
  queryDate;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private zone: NgZone,
    private userService: UserService,
    private authHttpService:AuthHttpService,
  ) {

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.zone.run(() => {

          this.getAlbaranPayload.school = this.router.getCurrentNavigation().extras.state.school.name;
          this.getAlbaranPayload.code = this.router.getCurrentNavigation().extras.state.school.code;
          this.getAlbaranPayload.dbDate = this.router.getCurrentNavigation().extras.state.date;
          this.getAlbaranPayload.currentDate = this.router.getCurrentNavigation().extras.state.currentDate;
          this.companyCode = this.router.getCurrentNavigation().extras.state.school.code;

          if(this.getAlbaranPayload.dbDate == undefined) {
            this.queryDate = this.getAlbaranPayload.currentDate;
          } else {
            this.queryDate = this.getAlbaranPayload.dbDate;
          }

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

        });
      }
      else{
        console.log("no");
      }
    });

   }

  ngOnInit() {
  }

}
