import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Settings } from './settings/settings';

@Component({
  selector: 'app-dashboard-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, Settings],
  templateUrl: './dashboard-settings.html',
  styleUrl: './dashboard-settings.css',
})
export class DashboardSettings {
  @ViewChild(Settings) private settings?: Settings;

  save(): void {
    this.settings?.savePreferences();
  }

  reset(): void {
    this.settings?.resetPreferencesToDefaults();
  }
}
