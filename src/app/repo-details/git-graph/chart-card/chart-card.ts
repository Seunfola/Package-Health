import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-card.html',
  styleUrl: './chart-card.css',
})
export class ChartCard {
  @Input() title: string = '';
  @Input() subtitle: string = '';
}
