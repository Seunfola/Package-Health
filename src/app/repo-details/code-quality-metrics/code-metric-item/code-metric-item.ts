import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-code-metric-item',
  standalone: true,
  imports: [],
  templateUrl: './code-metric-item.html',
  styleUrl: './code-metric-item.css',
})
export class CodeMetricItem {
  private _percentage: number = 0;

  @Input()
  set percentage(value: number) {
    if (value < 0 || value > 100) {
      console.warn(`Percentage value (${value}) is out of bounds. Clamped to [0, 100].`);
    }
    this._percentage = Math.max(0, Math.min(100, value));
  }

  get percentage(): number {
    return this._percentage;
  }

  @Input() title: string = '';
  @Input() iconPath: string = '';
}
