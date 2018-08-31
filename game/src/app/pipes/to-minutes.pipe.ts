import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toMinutes'
})
export class ToMinutesPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let minutes = Math.floor(value / 60);
    let seconds = value - minutes * 60;
    return seconds < 10 ? `${minutes} : 0${seconds}` : `${minutes} : ${seconds}`;
  }

}
