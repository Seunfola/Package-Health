import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-security-alert-item',
  standalone: true,
  imports: [],
  templateUrl: './security-alert-item.html',
  styleUrl: './security-alert-item.css',
})
export class SecurityAlertItem {
  @Input() severity: string = '';
  @Input() check: string = '';
  @Input() file: string = '';
  @Input() status: string = '';
}
