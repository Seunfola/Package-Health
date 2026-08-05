import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { generateIdempotencyKey } from '@/app/shared/utils';

/**
 * Wraps the repo-health analyze/dependency-scan endpoints used by the
 * homepage hero section and the private-repo-analysis panel — both
 * previously injected HttpClient directly instead of going through a
 * dedicated service, unlike every other feature area in this app.
 */
@Injectable({ providedIn: 'root' })
export class RepoHealthAnalysisService {
  private readonly baseUrl = `${environment.apiBaseUrl}/repo-health`;

  constructor(private readonly http: HttpClient) {}

  analyzeRepository(url: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/analyze`,
      { url },
      { headers: { 'x-idempotency-key': generateIdempotencyKey() } },
    );
  }

  analyzePrivateRepository(url: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/private`,
      { url },
      { headers: { 'x-idempotency-key': generateIdempotencyKey() } },
    );
  }

  analyzeDependenciesFromJson(parsed: Record<string, unknown>): Observable<any> {
    return this.http.post(`${this.baseUrl}/dependencies/json`, {
      json: JSON.stringify(parsed),
    });
  }

  analyzeDependenciesFromFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/dependencies/upload`, formData);
  }
}
