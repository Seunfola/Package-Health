import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { generateIdempotencyKey } from '@/app/shared/utils';

/** Mirrors the backend's `SecurityAlert` (`repo-health.interface.ts`) — a raw GitHub Dependabot alert, not a flattened summary. */
export interface RawSecurityAlert {
  id: string;
  number: number;
  state: 'open' | 'fixed' | 'dismissed';
  created_at: string;
  dependency: {
    package: { ecosystem: string; name: string };
    manifest_path: string;
    scope: 'development' | 'runtime';
  };
  security_advisory: {
    ghsa_id: string;
    cve_id: string | null;
    summary: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  };
}

/**
 * Mirrors the backend's `RepositoryHealthData` (`repo-health.interface.ts`)
 * field-for-field — this is the RAW analysis shape `/repo-health/analyze`,
 * `/repo-health/private`, and the dependency-scan endpoints return, distinct
 * from `AnalysisData` in `RepoService.ts` (the transformed shape
 * `/api/repos/:owner/:repo/analysis` returns for the dashboard). Consumers
 * previously typed these as `any` and read fields that don't exist on this
 * shape at all (`security_alerts` as flat objects with `.severity`/`.type`,
 * `risky_dependencies` items as `{name, reason}` objects) — the real shape is
 * `security_alert_details: RawSecurityAlert[]` and `risky_dependencies:
 * string[]` (each just `"package@version"`).
 */
export interface RepositoryAnalysisResult {
  repo_id: string;
  owner: string;
  repo: string;
  name: string;
  stars: number;
  forks: number;
  open_issues: number;
  last_pushed: string;
  security_alerts: number;
  security_alert_details?: RawSecurityAlert[];
  dependency_health: number;
  risky_dependencies: string[];
  overall_health: {
    score: number;
    label: string;
    metrics: Record<string, number>;
  };
  degraded?: boolean;
  degradedReason?: string;
}

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

  analyzeRepository(url: string): Observable<RepositoryAnalysisResult> {
    return this.http.post<RepositoryAnalysisResult>(
      `${this.baseUrl}/analyze`,
      { url },
      { headers: { 'x-idempotency-key': generateIdempotencyKey() } },
    );
  }

  /** `installationId` is required for a genuinely private repo — the backend rejects with 401 without one. */
  analyzePrivateRepository(url: string, installationId: string): Observable<RepositoryAnalysisResult> {
    return this.http.post<RepositoryAnalysisResult>(
      `${this.baseUrl}/private`,
      { url, installationId },
      { headers: { 'x-idempotency-key': generateIdempotencyKey() } },
    );
  }

  analyzeDependenciesFromJson(parsed: Record<string, unknown>): Observable<RepositoryAnalysisResult> {
    return this.http.post<RepositoryAnalysisResult>(`${this.baseUrl}/dependencies/json`, {
      json: JSON.stringify(parsed),
    });
  }

  analyzeDependenciesFromFile(file: File): Observable<RepositoryAnalysisResult> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<RepositoryAnalysisResult>(`${this.baseUrl}/dependencies/upload`, formData);
  }
}
