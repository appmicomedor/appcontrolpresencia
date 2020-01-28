import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'studentName'
})
export class StudentNamePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let sss;
    args.forEach(element => {
      if(element.id === value) {
        sss = element.student_name;
      }
    });
    return sss;
  }

}
