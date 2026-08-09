import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

export type LeakSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type LeakLiveness = 'live' | 'dead' | 'unknown' | 'not_checked';
export type LeakScanMode = 'working-tree' | 'staged' | 'diff';

/**
 * One finding, as stored by the backend from a `depvault leakguard scan
 * --upload`. `match` is always already redacted — see leak-guard-scan.model.ts's
 * class doc on the backend; there is no field here a raw secret could even
 * arrive in.
 */
export interface LeakFinding {
  ruleId: string;
  description: string;
  provider: string;
  severity: LeakSeverity;
  file: string;
  line: number;
  column: number;
  match: string;
  entropy?: number;
  isLikelyPlaceholder: boolean;
  allowlisted: boolean;
  liveness: LeakLiveness;
  fingerprint: string;
}

export interface LeakScanSummary {
  filesScanned: number;
  findingsTotal: number;
  findingsBySeverity: Record<LeakSeverity, number>;
  allowlisted: number;
  liveVerified: number;
  truncated: boolean;
}

/** `GET /api/repos/:owner/:repo/leak-scan` — mirrors the backend's `LeakGuardScan` document. */
export interface LeakGuardScanResult {
  scan_id: string;
  owner: string;
  repo: string;
  mode: LeakScanMode;
  findings: LeakFinding[];
  summary: LeakScanSummary;
  passed: boolean;
  failureReasons: string[];
  updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class LeakGuardService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Most repos have never had a LeakGuard scan uploaded — that's a 404, not
   * an error, since `depvault leakguard scan --upload` is opt-in. Callers
   * should treat a 404 the same as "no scan yet" rather than a load failure.
   */
  getLeakScan(owner: string, repo: string): Observable<LeakGuardScanResult> {
    return this.http.get<LeakGuardScanResult>(
      `${environment.apiBaseUrl}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/leak-scan`,
    );
  }
}
