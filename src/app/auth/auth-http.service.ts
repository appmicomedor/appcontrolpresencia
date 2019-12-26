import { Injectable } from '@angular/core';
import { Requestor,  } from '@openid/appauth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthHttpService {

  requestor: Requestor;
  //api_domain = 'https://apptitular.micomedor.net:3000/';
  api_domain = 'http://localhost:3000/';
  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  constructor(
    public httpClient : HttpClient
  ) {

  }
  
  request(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, postData?: any): Observable<any> {
    url = this.api_domain+url;
    if(method == 'GET')
      return this.httpClient.get(url).pipe(
        map(response =>{
          return response;
        })
      );
    else if(method == 'POST')
      return this.httpClient.post(url, postData);
  }

  public getHeader(){
    /*var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    const requestOptions = new RequestOptions({ headers: headers });*/
  }
}
