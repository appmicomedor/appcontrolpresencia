import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
@Injectable({
  providedIn: 'root'
})
export class UtilService {


  Weekdays = [
    {es:"Domingo",    en:"Sunday"},
    {es:"Lunes",      en:"Monday"}, 
    {es:"Martes",     en:"Tuesday"}, 
    {es:"Miércoles",  en:"Wednesday"}, 
    {es:"Jueves",     en:"Thursday"}, 
    {es:"Viernes",    en:"Friday"}, 
    {es:"Sábado",     en:"Saturday"}
  ];
  
  Months = [
    {es:"Enero",      en:"January"}, 
    {es:"Febrero",    en:"February"}, 
    {es:"Marzo",      en:"March"}, 
    {es:"Abril",      en:"April"}, 
    {es:"Mayo",       en:"May"}, 
    {es:"Junio",      en:"June"}, 
    {es:"Julio",      en:"July"},
    {es:"Agosto",     en:"August"},
    {es:"Septiembre", en:"September"},
    {es:"Octubre",    en:"October"},
    {es:"Noviembre",  en:"November"},
    {es:"Diciembre",  en:"December"}
  ];

  constructor(public storage: Storage) {

  }

  formatYMD(date)
  {
    var dd = date.getDate();
    var mm = date.getMonth()+1; //January is 0!
    
    var yyyy = date.getFullYear();
    if(dd<10){
        dd='0'+dd;
    } 
    if(mm<10){
        mm='0'+mm;
    } 
    return ( yyyy + '-' + mm + '-' + dd );    
  } 

  presentDate(dt)
  {
    let language = 'es';

    var date = new Date(dt);
    var result = '';
    var dayWeek = date.getDay();

    if (language=='es')
      result += this.Weekdays[dayWeek].es;
    else if (language=='en')
      result += this.Weekdays[dayWeek].en;

    result += ', ';

    var dd = date.getDate();
    var mm = date.getMonth(); //January is 0!
    var yy = date.getFullYear();

    if (language=='es')
      result += dd + ' de ' + this.Months[mm].es+ ' de ' +  yy;
    else if (language=='en')
      result += dd + ' ' + this.Months[mm].en + ' ' +  yy;

    return result;
  }

  formatDateTime(dt)
  {
    if (dt==null || dt=='')
      return '';

    var date = new Date(dt);

    var dd = date.getDate();
    var mm = date.getMonth()+1; //January is 0!
    var h = date.getHours();
    var m = date.getMinutes();
    
    var yyyy = date.getFullYear();
    let result = '';

    if(dd<10)
      result+= '0';
    result+=dd + '/';

    if(mm<10)
      result+= '0';
    result+=mm + '/';

    result+=yyyy + ' ';

    if(h<10)
      result+= '0';
    result+=h + ':';

    if(m<10)
      result+= '0';
    result+=m;

    return result; 
  } 
    
  getDaysInMonth(month, year) {
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  getPrevDays(indate){

    var days = [];
    for (var i = 1; i <= 7; ++i) {
      var date = new Date(indate);
      date.setDate(indate.getDate() - i);
      days.push(date);
    }
    return days;
  }

  getNextDays(indate){
    
    var days = [];
    for (var i = 1; i <= 7; ++i) {
      var date = new Date(indate);
      date.setDate(indate.getDate() + i);
      days.push(date);
    }
    return days;
  }  
}
