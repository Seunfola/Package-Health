import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

export const NOTIFICATION_TYPES = [
  'SYSTEM_ALERT',
  'SECURITY_ALERT',
  'SECURITY_VULNERABILITY',
  'DEPENDENCY_UPDATE',
  'NEW_ISSUE',
  'PULL_REQUEST',
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const NOTIFICATION_PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;
export type NotificationPriority = (typeof NOTIFICATION_PRIORITIES)[number];

/**
 * Mirrors the backend's actual `NotificationResponseDto` field-for-field
 * (`notification.dto.ts`). This previously declared `id`/`isRead`/`message`/
 * `severity`/`userId` — none of which the DTO has (real fields: `_id`,
 * `read`, `description`, `priority`; there is no `userId` in the response at
 * all, notifications are scoped server-side). Every notification silently
 * always showed as unread, and "mark as read" always posted to
 * `/notifications/undefined/read`, because the id field it read never existed
 * on the real response.
 */
export interface NotificationResponse {
  _id: string;
  type: NotificationType;
  repository: string;
  repositoryUrl: string;
  title: string;
  description?: string;
  priority: NotificationPriority;
  detailsUrl?: string;
  read: boolean;
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationQuery {
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
  type?: NotificationType;
  priority?: NotificationPriority;
  repository?: string;
}

export interface NotificationSummary {
  total: number;
  unread: number;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
}

export interface BulkOperationResult {
  success: boolean;
  message: string;
  affectedIds?: string[];
  updated?: number;
  deleted?: number;
}

export interface CreateNotificationRequest {
  type: NotificationType;
  repository: string;
  repositoryUrl: string;
  title: string;
  description?: string;
  priority: NotificationPriority;
  detailsUrl?: string;
  metadata?: Record<string, unknown>;
}

function toHttpParams(query?: NotificationQuery): HttpParams {
  let params = new HttpParams();
  if (!query) return params;
  if (query.limit !== undefined) params = params.set('limit', query.limit);
  if (query.offset !== undefined) params = params.set('offset', query.offset);
  if (query.unreadOnly !== undefined) params = params.set('unreadOnly', query.unreadOnly);
  if (query.type) params = params.set('type', query.type);
  if (query.priority) params = params.set('priority', query.priority);
  if (query.repository) params = params.set('repository', query.repository);
  return params;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly API_URL = `${environment.apiBaseUrl}/notifications`;

  constructor(private readonly http: HttpClient) {}

  getNotifications(query?: NotificationQuery): Observable<NotificationResponse[]> {
    return this.http.get<NotificationResponse[]>(this.API_URL, { params: toHttpParams(query) });
  }

  getSummary(): Observable<NotificationSummary> {
    return this.http.get<NotificationSummary>(`${this.API_URL}/summary`);
  }

  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.API_URL}/stats/unread`);
  }

  /** `repository` in `"owner/repo"` format. */
  getByRepository(repository: string): Observable<NotificationResponse[]> {
    return this.http.get<NotificationResponse[]>(`${this.API_URL}/repository/${encodeURIComponent(repository)}`);
  }

  getById(id: string): Observable<NotificationResponse> {
    return this.http.get<NotificationResponse>(`${this.API_URL}/${id}`);
  }

  search(term: string, query?: NotificationQuery): Observable<NotificationResponse[]> {
    return this.http.get<NotificationResponse[]>(`${this.API_URL}/search/${encodeURIComponent(term)}`, {
      params: toHttpParams(query),
    });
  }

  create(payload: CreateNotificationRequest): Observable<NotificationResponse> {
    return this.http.post<NotificationResponse>(this.API_URL, payload);
  }

  /** Triggers the backend to generate health/security notifications for a repo the caller has analyzed. */
  generateForRepository(owner: string, repo: string): Observable<{ generated: number; notifications: NotificationResponse[] }> {
    return this.http.post<{ generated: number; notifications: NotificationResponse[] }>(
      `${this.API_URL}/generate/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
      {},
    );
  }

  markAsRead(id: string): Observable<NotificationResponse> {
    return this.http.post<NotificationResponse>(`${this.API_URL}/${id}/read`, {});
  }

  markMultipleAsRead(notificationIds: string[]): Observable<BulkOperationResult> {
    return this.http.post<BulkOperationResult>(`${this.API_URL}/mark-read`, { notificationIds });
  }

  markAllAsRead(): Observable<{ modifiedCount: number }> {
    return this.http.post<{ modifiedCount: number }>(`${this.API_URL}/read-all`, {});
  }

  update(id: string, patch: { read?: boolean; metadata?: Record<string, unknown> }): Observable<NotificationResponse> {
    return this.http.put<NotificationResponse>(`${this.API_URL}/${id}`, patch);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/${id}`);
  }

  deleteMultiple(ids: string[]): Observable<BulkOperationResult> {
    return this.http.delete<BulkOperationResult>(`${this.API_URL}/bulk/delete`, { body: { ids } });
  }

  /** Deletes every one of the caller's own notifications. */
  deleteAll(): Observable<{ deletedCount: number }> {
    return this.http.delete<{ deletedCount: number }>(this.API_URL);
  }

  /** Deletes the caller's own notifications older than `days` (default 30). */
  cleanupOld(days = 30): Observable<{ deletedCount: number }> {
    return this.http.post<{ deletedCount: number }>(`${this.API_URL}/cleanup`, {}, { params: { days } });
  }
}
