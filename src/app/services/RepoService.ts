import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

export interface DependencyNode {
  id: string;
  group: number;
  type: 'safe' | 'vulnerable' | 'critical';
}

export interface DependencyLink {
  source: string;
  target: string;
}

export interface DependencyData {
  nodes: DependencyNode[];
  links: DependencyLink[];
}

export interface VulnerabilityDetails {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  package: string;
  vulnerable_version_range: string;
  first_patched_version: string | null;
  state: 'open' | 'fixed' | 'dismissed';
  created_at: string;
  description?: string;
}

export interface SecurityAlertSummary {
  severity: 'critical' | 'high' | 'medium' | 'low';
  count: number;
}

export interface AnalysisData {
  repoName: string;
  stars: number;
  forks: number;
  lastCommit: string;
  openChecks: number;
  contributionData: { date: string; count: number }[];
  commitData: number[];
  commitLabels: string[];
  overallHealth: number;
  dependencyData?: DependencyData;
  securityAlerts?: VulnerabilityDetails[];
  securitySummary?: SecurityAlertSummary[];
  totalVulnerabilities?: number;
  healthMetrics?: {
    security: number;
    performance: number;
    reliability: number;
    maintainability: number;
  };
  /**
   * True when this trust score was computed from partial dependency data
   * (e.g. some package lookups failed) — the score is still the best
   * available estimate, but the UI should say so rather than presenting it
   * with the same confidence as a full analysis.
   */
  degraded?: boolean;
  degradedReason?: string;
}

/**
 * A single stored repo-health record, as returned by `GET /api/repos`
 * (paginated list) and `GET /api/repos/owner/:owner`. Mirrors the backend's
 * `RepoHealthDocument` (Mongoose schema in `repo-health.model.ts`).
 */
export interface RepoListItem {
  repo_id: string;
  owner: string;
  repo: string;
  name?: string;
  stars?: number;
  forks?: number;
  open_issues?: number;
  last_pushed?: string;
  overall_health?: {
    score: number;
    label: string;
    metrics?: {
      security: number;
      performance: number;
      reliability: number;
      maintainability: number;
    };
  };
  security_alerts?: number;
  dependency_health?: number;
  days_behind?: number;
}

/** `GET /api/repos` — paginated repo list response. */
export interface PaginatedRepos {
  data: RepoListItem[];
  total: number;
  page: number;
  totalPages: number;
}

/** `GET /api/repos/stats` — aggregate stats across all analyzed repos. */
export interface RepoStats {
  totalRepos: number;
  averageHealth: number;
  healthDistribution: {
    excellent: number;
    good: number;
    moderate: number;
    poor: number;
  };
}

@Injectable({ providedIn: 'root' })
export class RepoService {
  constructor(private readonly http: HttpClient) {}

  getAnalysisData(owner: string, name: string): Observable<AnalysisData> {
    return this.http.get<AnalysisData>(
      `${environment.apiBaseUrl}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}/analysis`,
    );
  }

  /** `GET /api/repos` — paginated list of previously-analyzed repositories. */
  getRepos(page: number = 1, limit: number = 10, sort?: string): Observable<PaginatedRepos> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (sort) {
      params = params.set('sort', sort);
    }
    return this.http.get<PaginatedRepos>(`${environment.apiBaseUrl}/repos`, { params });
  }

  /** `GET /api/repos/stats` — aggregate health stats across all analyzed repositories. */
  getRepoStats(): Observable<RepoStats> {
    return this.http.get<RepoStats>(`${environment.apiBaseUrl}/repos/stats`);
  }
}
