import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

export interface GatekeeperPolicy {
  enabled: boolean;
  threshold?: number;
}

export interface GatekeeperPolicyConfig {
  block_critical_cves: GatekeeperPolicy;
  block_ghost_towns: GatekeeperPolicy;
  block_gpl_licenses: GatekeeperPolicy;
  warn_ecosystem_conflicts: GatekeeperPolicy;
}

@Injectable({
  providedIn: 'root'
})
export class GatekeeperService {
  private readonly baseUrl = `${environment.apiBaseUrl}/gatekeeper/policies`;

  constructor(private readonly http: HttpClient) {}

  getPolicies(orgId: string = 'default-org'): Observable<GatekeeperPolicyConfig> {
    return this.http.get<GatekeeperPolicyConfig>(`${this.baseUrl}/${orgId}`);
  }

  updatePolicies(orgId: string = 'default-org', policies: GatekeeperPolicyConfig): Observable<GatekeeperPolicyConfig> {
    return this.http.put<GatekeeperPolicyConfig>(`${this.baseUrl}/${orgId}`, policies);
  }
}
