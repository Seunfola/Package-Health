import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SettingsItem } from './settings-item/settings-item';
import { FormsModule } from '@angular/forms';
import { SettingsCard } from './settings-card/settings-card';
import { SettingsInput } from './settings-input/settings-input';
import { AuthLogin } from '@/app/services/auth-login.component';
import { PrivateRepoAnalysisComponent } from '@/app/services/private-repo-analysis.component';
import { PreferencesService, UpdatePreferencesDto } from '@/app/services/preferences.service';
import { AuthService } from '@/app/services/auth.service';
import { UnauthorizedWarning } from '@/app/shared/unauthorized-warning/unauthorized-warning';

/**
 * Personal preferences only — Organization, Members, Tokens, Gatekeeper
 * Policy, and Notification Webhooks each moved to their own subroute (see
 * ../organization, ../members, ../tokens, ../gatekeeper, ../webhooks) once
 * this was a single ~750-line component covering all of them plus this.
 */
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    SettingsItem,
    FormsModule,
    SettingsCard,
    SettingsInput,
    AuthLogin,
    PrivateRepoAnalysisComponent,
    UnauthorizedWarning,
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit {
  codeQualityScore = true;
  testCoverage = true;
  dependencyVulnerabilities = true;
  securityAlerts = true;

  emailNotifications = true;
  inAppNotifications = true;
  securityThreshold = '80'; // Keeping as string to match input, but will parse to number
  dependencyUpdateFrequency = 'Daily';

  frequencies = ['Daily', 'Weekly', 'Monthly'];

  isLoading = true;
  isSaving = false;
  message = '';

  constructor(
    private readonly preferencesService: PreferencesService,
    private readonly authService: AuthService,
  ) {}

  get authState$() {
    return this.authService.authState$;
  }

  ngOnInit(): void {
    this.loadPreferences();
  }

  loadPreferences(): void {
    this.isLoading = true;
    this.preferencesService.getPreferences().subscribe({
      next: (prefs) => {
        const db = prefs.dashboardMetrics;
        const np = prefs.notificationPreferences;

        this.codeQualityScore = db.codeQualityScore;
        this.testCoverage = db.testCoverage;
        this.dependencyVulnerabilities = db.dependencyVulnerabilities;
        this.securityAlerts = db.securityAlerts;

        this.emailNotifications = np.emailNotifications;
        this.inAppNotifications = np.inAppNotifications;
        this.securityThreshold = np.securityAlertThreshold.toString();
        this.dependencyUpdateFrequency = np.dependencyUpdateFrequency.charAt(0).toUpperCase() + np.dependencyUpdateFrequency.slice(1);

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load preferences', err);
        // Fallback to defaults or keep UI defaults if backend has no preferences yet
        this.isLoading = false;
      },
    });
  }

  resetPreferencesToDefaults(): void {
    this.isSaving = true;
    this.message = '';
    this.preferencesService.resetToDefaults().subscribe({
      next: () => {
        this.isSaving = false;
        this.message = 'Preferences reset to defaults.';
        this.loadPreferences();
      },
      error: (err) => {
        console.error('Failed to reset preferences', err);
        this.isSaving = false;
        this.message = 'Failed to reset preferences.';
      },
    });
  }

  savePreferences(): void {
    this.isSaving = true;
    this.message = '';

    const payload: UpdatePreferencesDto = {
      dashboardMetrics: {
        codeQualityScore: this.codeQualityScore,
        testCoverage: this.testCoverage,
        dependencyVulnerabilities: this.dependencyVulnerabilities,
        securityAlerts: this.securityAlerts,
      },
      notificationPreferences: {
        emailNotifications: this.emailNotifications,
        inAppNotifications: this.inAppNotifications,
        securityAlertThreshold: parseInt(this.securityThreshold.replace('%', ''), 10) || 80,
        dependencyUpdateFrequency: this.dependencyUpdateFrequency.toLowerCase(),
      },
    };

    this.preferencesService.updatePreferences(payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.message = 'Preferences saved successfully!';
        setTimeout(() => (this.message = ''), 3000);
      },
      error: (err) => {
        console.error('Failed to save preferences', err);
        this.isSaving = false;
        this.message = 'Failed to save preferences.';
      },
    });
  }
}
