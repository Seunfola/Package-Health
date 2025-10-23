import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}


@Injectable({ providedIn: 'root' })
export class RepoService {
  constructor(private http: HttpClient) {}

  getAnalysisData(owner: string, name: string): Observable<AnalysisData> {
    return this.http.get<AnalysisData>(
      `/api/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}/analysis`,
    );
  }
}
