import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

export interface UserProfileResponse {
  id: string;
  username: string;
  email?: string;
  githubUsername?: string;
  linkedinProfileUrl?: string;
  twitterHandle?: string;
  profileSummary?: string;
  location?: string;
  skills?: string[];
  resumeFileId?: string;
}

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private readonly API_URL = `${environment.apiBaseUrl}/profile`;

  constructor(private readonly http: HttpClient) {}

  getProfile(username: string): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(`${this.API_URL}/${username}`);
  }

  linkSocialProfile(userId: string, platform: string, username: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/link-social`, {
      userId,
      platform,
      username,
    });
  }

  uploadResume(userId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('resume', file);
    return this.http.post<any>(`${this.API_URL}/upload-resume/${userId}`, formData);
  }
}
