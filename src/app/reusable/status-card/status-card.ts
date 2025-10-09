import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-card.html',
  styleUrl: './status-card.css',
})
export class StatusCard {
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() icon: string = '';
}
