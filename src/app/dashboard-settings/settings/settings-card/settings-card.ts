import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-settings-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings-card.html',
  styleUrl: './settings-card.css',
})
export class SettingsCard {
  @Input() title: string = '';
  @Input() subtitle: string = '';
}
