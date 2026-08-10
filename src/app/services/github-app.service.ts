import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

export interface GithubAppInstallation {
  _id: string;
  userId: string;
  installationId: string;
  accountLogin?: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class GithubAppService {
  private readonly baseUrl = `${environment.apiBaseUrl}/repo-health/github-app`;

  constructor(private readonly http: HttpClient) {}

  /** A state-bound install URL — redirect the browser here to install/configure the DepVault GitHub App. */
  getInstallUrl(): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.baseUrl}/install-url`);
  }

  getMyInstallations(): Observable<GithubAppInstallation[]> {
    return this.http.get<GithubAppInstallation[]>(`${this.baseUrl}/installations/mine`);
  }
}
