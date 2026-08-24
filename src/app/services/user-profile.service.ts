import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

/**
 * Mirrors the backend's actual `UserProfile` Mongoose schema field-for-field
 * (`user-profile.model.ts`). This previously declared fields the schema has
 * never had (`githubUsername`, `linkedinProfileUrl`, `twitterHandle`,
 * `profileSummary`, `resumeFileId`) — every real API response silently left
 * them `undefined`, so the "Connected Social Accounts" card always rendered
 * blank even after a successful link, and edits to summary/location/skills
 * had nowhere real to be saved. `bio`/`location`/`skills` are genuine schema
 * fields now (see the backend model + `UpdateUserProfileDto`).
 */
export interface UserProfileResponse {
  id: string;
  username: string;
  name?: string;
  email?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  linkedin_url?: string;
  github_url?: string;
  twitter_url?: string;
  profile_picture_url?: string;
}

export type UpdateUserProfileRequest = Partial<
  Pick<UserProfileResponse, 'name' | 'email' | 'bio' | 'location' | 'skills' | 'linkedin_url' | 'github_url' | 'twitter_url'>
>;

/**
 * The `GET /profile` directory listing never includes `email` — the backend
 * projects it out at the query level (see user-profile.service.ts's
 * findAll()) to satisfy the privacy policy's "your email is never included
 * in the 'all profiles' listing" promise. Modeled as `Omit`, not a
 * hand-duplicated field list, so it can't silently drift from
 * UserProfileResponse.
 */
export type ProfileListItem = Omit<UserProfileResponse, 'email'>;

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private readonly API_URL = `${environment.apiBaseUrl}/profile`;

  constructor(private readonly http: HttpClient) {}

  getProfile(username: string): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(`${this.API_URL}/${username}`);
  }

  /**
   * `GET /profile` — the paginated profile directory. Cursor-based: pass the
   * `username` of the last profile in the previous page as `after` to fetch
   * the next one, mirroring `OrganizationService.getAuditLog()`'s pagination
   * shape (limit + cursor, server-capped).
   */
  listProfiles(options?: { limit?: number; after?: string }): Observable<ProfileListItem[]> {
    const params: Record<string, string> = {};
    if (options?.limit !== undefined) params['limit'] = String(options.limit);
    if (options?.after) params['after'] = options.after;
    return this.http.get<ProfileListItem[]>(this.API_URL, { params });
  }

  /** `POST /profile` — create-or-update the caller's own profile. */
  updateProfile(patch: UpdateUserProfileRequest): Observable<{ message: string; data: UserProfileResponse }> {
    return this.http.post<{ message: string; data: UserProfileResponse }>(this.API_URL, patch);
  }

  linkSocialProfile(platform: string, username: string): Observable<{ message: string; data: UserProfileResponse }> {
    return this.http.post<{ message: string; data: UserProfileResponse }>(`${this.API_URL}/link-social`, {
      platform,
      username,
    });
  }

  uploadResume(file: File): Observable<{ message: string; data?: UserProfileResponse }> {
    const formData = new FormData();
    formData.append('resume', file);
    return this.http.post<{ message: string; data?: UserProfileResponse }>(`${this.API_URL}/upload-resume`, formData);
  }
}
