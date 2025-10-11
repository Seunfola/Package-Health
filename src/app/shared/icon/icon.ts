import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `<img [src]="iconUrl" class="icon" [alt]="iconType + ' icon'" />`,
  styleUrls: ['./icon.css'],
})
export class IconComponent {
  @Input() iconType = '';

  get iconUrl(): string {
    // ✅ expects files like src/assets/icons/alert.svg
    return `assets/icons/${this.iconType}.svg`;
  }
}
