import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TelemetrySummary {
  totalPings: number;
  distinctInstalls: number;
  bySource: Array<{ source: string; count: number }>;
  byTool: Array<{ tool: string; count: number }>;
  byEcosystem: Array<{ ecosystem: string; count: number }>;
  dailyCounts: Array<{ date: string; count: number }>;
}

@Injectable({ providedIn: 'root' })
export class TelemetryService {
  private readonly API_URL = `${environment.apiBaseUrl}/telemetry`;

  constructor(private readonly http: HttpClient) {}

  getSummary(days = 90): Observable<TelemetrySummary> {
    return this.http.get<TelemetrySummary>(`${this.API_URL}/summary`, { params: { days } });
  }
}
