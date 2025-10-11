import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-item.html',
  styleUrl: './settings-item.css',
})
export class SettingsItem {
  @Input() title: string = '';
  @Input() subtitle: string = '';

  @Input() enabled: boolean = false;

  @Output() enabledChange = new EventEmitter<boolean>();

  onValueChange(newValue: boolean): void {
    this.enabledChange.emit(newValue);
  }
}
