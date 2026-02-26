import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environment/environment';

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
}

@Injectable({ providedIn: 'root' })
export class RepoService {
  constructor(private readonly http: HttpClient) {}

  getAnalysisData(owner: string, name: string): Observable<AnalysisData> {
    return this.http.get<AnalysisData>(
      `${environment.apiBaseUrl}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}/analysis`,
    );
  }
}
