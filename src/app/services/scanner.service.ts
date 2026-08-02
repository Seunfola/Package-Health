import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/** Mirrors `@depvault/core`'s `MonteCarloResult` — 95% Monte Carlo confidence interval. */
export interface MonteCarloResult {
  /** 2.5th percentile (lower bound of 95% CI). */
  p2_5: number;
  /** 97.5th percentile (upper bound of 95% CI). */
  p97_5: number;
  /** Median (50th percentile). */
  p50: number;
}

/** Mirrors `@depvault/core`'s `DiversityResult` — maintainer diversity metrics. */
export interface DiversityResult {
  /** Raw Shannon entropy in bits. */
  H: number;
  /** Normalized entropy [0, 1]. 1 = fully diverse, 0 = single maintainer/org. */
  Hnorm: number;
  /** Number of distinct organizational groups. */
  groupCount: number;
}

/** Mirrors `@depvault/core`'s `TrustScoreResult` — full trust score breakdown. */
export interface TrustScoreResult {
  /** Weighted final score [0, 100]. */
  finalScore: number;
  /** Security sub-score [0, 100] from Poisson CDF. */
  securityScore: number;
  /** Freshness factor [0, 1] from half-life decay. */
  freshness: number;
  /** Category prior weight (w), not 1+w. */
  categoryPrior: number;
  /** Maintainer diversity metrics. */
  diversity: DiversityResult;
  /** 95% Monte Carlo confidence interval (null if MC disabled). */
  ci: MonteCarloResult | null;
  /** Marginal sensitivity d(score)/dB. */
  sensitivity: number;
  /** Sum of CVSS base scores (vulnerability burden). */
  vulnerabilityBurden: number;
  /** Individual sub-scores for transparency. */
  subscores: {
    license: number;
    maintenance: number;
    popularity: number;
    /** Maintenance adjusted by freshness factor. */
    adjustedMaintenance: number;
  };
}

/** Result of `ScannerService.scanPackage()` — `GET {apiUrl}/scan/:ecosystem/:packageName`. */
export interface ScanResult {
  ecosystem: string;
  package: string;
  version: string;
  trustScore: TrustScoreResult;
  hasCriticalVulnerabilities: boolean;
  details?: {
    metadata?: Record<string, unknown>;
    downloads?: Record<string, unknown>;
    maintainers?: Record<string, unknown>[];
    vulnerabilities?: Record<string, unknown>[];
  };
}

/** A single ranked fix suggestion from `GET {apiUrl}/scan/:ecosystem/:packageName/fix`. */
export interface FixSuggestion {
  /** Package name. */
  package: string;
  /** Currently installed version. */
  currentVersion: string;
  /** Recommended target version. */
  fixedVersion: string;
  /** Security score before the fix [0, 100]. */
  scoreBefore: number;
  /** Security score after the fix [0, 100]. */
  scoreAfter: number;
  /** Exact score improvement (scoreAfter - scoreBefore). */
  deltaScore: number;
  /** Marginal sensitivity d(score)/dB at the current burden. */
  sensitivity: number;
  /** Suggested install command. */
  command: string;
  /** Vulnerability IDs this fix resolves. */
  resolvedVulnIds: string[];
  /** Severity breakdown of resolved vulns. */
  resolvedSeverities: Record<string, number>;
}

/** Response of `GET {apiUrl}/scan/:ecosystem/:packageName/report`. */
export interface ScanReportResponse {
  report: string;
}

@Injectable({
  providedIn: 'root',
})
export class ScannerService {
  private readonly BASE_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  scanPackage(ecosystem: string, packageName: string, version?: string): Observable<ScanResult> {
    let params = new HttpParams();
    if (version) {
      params = params.set('version', version);
    }
    return this.http.get<ScanResult>(
      `${this.BASE_URL}/scan/${encodeURIComponent(ecosystem)}/${encodeURIComponent(packageName)}`,
      { params },
    );
  }

  getScanHistory(ecosystem: string, packageName: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.BASE_URL}/history/${encodeURIComponent(ecosystem)}/${encodeURIComponent(packageName)}`,
    );
  }

  /** `GET {apiUrl}/scan/:ecosystem/:packageName/fix` — ranked upgrade suggestions (0 or 1 items today). */
  getFixSuggestions(ecosystem: string, packageName: string): Observable<FixSuggestion[]> {
    return this.http.get<FixSuggestion[]>(
      `${this.BASE_URL}/scan/${encodeURIComponent(ecosystem)}/${encodeURIComponent(packageName)}/fix`,
    );
  }

  /** `GET {apiUrl}/scan/:ecosystem/:packageName/report` — human-readable trust score report. */
  getReport(ecosystem: string, packageName: string): Observable<ScanReportResponse> {
    return this.http.get<ScanReportResponse>(
      `${this.BASE_URL}/scan/${encodeURIComponent(ecosystem)}/${encodeURIComponent(packageName)}/report`,
    );
  }

  /** `GET {apiUrl}/sbom/:ecosystem/:packageName` — CycloneDX JSON SBOM. */
  generateSbom(ecosystem: string, packageName: string): Observable<Record<string, unknown>> {
    return this.http.get<Record<string, unknown>>(
      `${this.BASE_URL}/sbom/${encodeURIComponent(ecosystem)}/${encodeURIComponent(packageName)}`,
    );
  }

  /** `GET {apiUrl}/badge/:ecosystem/:packageName` — inline SVG trust score badge. */
  getBadge(ecosystem: string, packageName: string): Observable<string> {
    return this.http.get(
      `${this.BASE_URL}/badge/${encodeURIComponent(ecosystem)}/${encodeURIComponent(packageName)}`,
      { responseType: 'text' },
    );
  }
}
