import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SettingsItem } from './settings-item/settings-item';
import { FormsModule } from '@angular/forms';
import { SettingsCard } from './settings-card/settings-card';
import { SettingsInput } from './settings-input/settings-input';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, SettingsItem, FormsModule, SettingsCard, SettingsInput],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  codeQualityScore = true;
  testCoverage = true;
  dependencyVulnerabilities = true;
  securityAlerts = true;

  emailNotifications = true;
  inAppNotifications = true;
  securityThreshold = '80%';
  dependencyUpdateFrequency = 'Daily';

  frequencies = ['Daily', 'Weekly', 'Monthly'];
}
