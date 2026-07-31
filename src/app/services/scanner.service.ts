import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ScanResult {
  trustScore: number;
  lastScanned: string;
  hasCriticalVulnerabilities: boolean;
  riskyDependencies: any[];
  statusCards: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ScannerService {
  private readonly API_URL = `${environment.apiUrl}/scan`;

  constructor(private http: HttpClient) {}

  scanPackage(ecosystem: string, packageName: string, version?: string): Observable<ScanResult> {
    let params = new HttpParams();
    if (version) {
      params = params.set('version', version);
    }
    return this.http.get<ScanResult>(`${this.API_URL}/${ecosystem}/${packageName}`, { params });
  }

  getScanHistory(ecosystem: string, packageName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/history/${ecosystem}/${packageName}`);
  }
}
