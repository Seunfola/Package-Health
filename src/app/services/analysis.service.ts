import { Injectable } from '@angular/core';
import { RepositoryAnalysisResult } from './repo-health-analysis.service';

/**
 * Hands off a one-off analysis result (from the homepage's quick-analyze
 * widget — paste JSON, upload a file, or a not-yet-persisted GitHub URL
 * scan) to /repository-details, which has no owner/name to fetch by in
 * those cases. Consumed once, then cleared — see RepoDetails.ngOnInit().
 */
@Injectable({ providedIn: 'root' })
export class AnalysisService {
  private data: RepositoryAnalysisResult | null = null;

  setAnalysis(data: RepositoryAnalysisResult): void {
    this.data = data;
  }

  getAnalysis(): RepositoryAnalysisResult | null {
    return this.data;
  }

  clear(): void {
    this.data = null;
  }
}
