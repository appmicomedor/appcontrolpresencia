import { Injectable } from '@angular/core';
import { AuthHttpService } from './auth-http.service';
import { resolve } from 'dns';
import { rejects } from 'assert';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {

  constructor(
    private httpService: AuthHttpService,) { }

  checkUserRole(username) {

    return new Promise( (resolve, reject) => {
      this.httpService.request('GET', 'check-user-role?username='+username).subscribe( res => {
        console.log(res.message);
        if(res){
          resolve(res.message[0].access.split(','));
        } else {
          reject('error getting the roles');
        }
      });
    })

    
  }

}
