import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

export interface DashboardMetricsDto {
  codeQualityScore: boolean;
  testCoverage: boolean;
  dependencyVulnerabilities: boolean;
  securityAlerts: boolean;
}

export interface NotificationPreferencesDto {
  emailNotifications: boolean;
  inAppNotifications: boolean;
  securityAlertThreshold: number;
  dependencyUpdateFrequency: string;
}

export interface PreferencesResponseDto {
  userId: string;
  dashboardMetrics: DashboardMetricsDto;
  notificationPreferences: NotificationPreferencesDto;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdatePreferencesDto {
  dashboardMetrics: DashboardMetricsDto;
  notificationPreferences: NotificationPreferencesDto;
}

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  private readonly API_URL = `${environment.apiBaseUrl}/user/preferences`;

  constructor(private readonly http: HttpClient) {}

  getPreferences(): Observable<PreferencesResponseDto> {
    return this.http.get<PreferencesResponseDto>(this.API_URL);
  }

  updatePreferences(data: UpdatePreferencesDto): Observable<PreferencesResponseDto> {
    return this.http.put<PreferencesResponseDto>(this.API_URL, data);
  }

  getDefaults(): Observable<PreferencesResponseDto> {
    return this.http.get<PreferencesResponseDto>(`${this.API_URL}/defaults`);
  }

  resetToDefaults(): Observable<PreferencesResponseDto> {
    return this.http.post<PreferencesResponseDto>(`${this.API_URL}/reset`, {});
  }
}
