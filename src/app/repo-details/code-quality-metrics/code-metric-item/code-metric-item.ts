import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-code-metric-item',
  standalone: true,
  imports: [],
  templateUrl: './code-metric-item.html',
  styleUrl: './code-metric-item.css',
})
export class CodeMetricItem {
  @Input() percentage: number = 0;
  @Input() title: string = '';
  @Input() iconPath: string = '';
}
