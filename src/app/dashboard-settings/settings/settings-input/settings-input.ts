import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-settings-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings-input.html',
  styleUrl: './settings-input.css',
})
export class SettingsInput {
  @Input() title: string = '';
  @Input() subtitle: string = '';
}
