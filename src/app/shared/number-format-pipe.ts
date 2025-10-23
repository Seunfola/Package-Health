import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat',
  standalone: true,
})
export class NumberFormatPipe implements PipeTransform {
  transform(value: number): string {
    if (value >= 100) {
      return (value / 100).toFixed(1) + 'K';
    }
    return value.toString();
  }
}
