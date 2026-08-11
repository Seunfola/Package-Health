import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

export interface PersonalAccessTokenSummary {
  id: string;
  name: string;
  tokenPrefix: string;
  createdAt: string;
  lastUsedAt: string | null;
}

export interface CreatedPersonalAccessToken {
  token: string;
  summary: PersonalAccessTokenSummary;
}

@Injectable({ providedIn: 'root' })
export class PersonalAccessTokenService {
  private readonly baseUrl = `${environment.apiBaseUrl}/tokens`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<PersonalAccessTokenSummary[]> {
    return this.http.get<PersonalAccessTokenSummary[]>(this.baseUrl);
  }

  /** The raw token in the response is shown to the user exactly once — it is never retrievable again. */
  create(name: string): Observable<CreatedPersonalAccessToken> {
    return this.http.post<CreatedPersonalAccessToken>(this.baseUrl, { name });
  }

  revoke(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
