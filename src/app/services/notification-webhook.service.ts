import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

export type NotificationWebhookType = 'slack' | 'discord' | 'pagerduty' | 'custom';

export interface NotificationWebhook {
  _id: string;
  orgId: string;
  type: NotificationWebhookType;
  url: string;
  enabled: boolean;
  label?: string;
}

export interface CreateNotificationWebhookRequest {
  type: NotificationWebhookType;
  url: string;
  enabled?: boolean;
  label?: string;
}

export interface UpdateNotificationWebhookRequest {
  url?: string;
  enabled?: boolean;
  label?: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationWebhookService {
  private readonly baseUrl = `${environment.apiBaseUrl}/notification-webhooks`;

  constructor(private readonly http: HttpClient) {}

  list(orgId: string = 'default-org'): Observable<NotificationWebhook[]> {
    return this.http.get<NotificationWebhook[]>(`${this.baseUrl}/${orgId}`);
  }

  create(payload: CreateNotificationWebhookRequest, orgId: string = 'default-org'): Observable<NotificationWebhook> {
    return this.http.post<NotificationWebhook>(`${this.baseUrl}/${orgId}`, payload);
  }

  update(id: string, payload: UpdateNotificationWebhookRequest, orgId: string = 'default-org'): Observable<NotificationWebhook> {
    return this.http.patch<NotificationWebhook>(`${this.baseUrl}/${orgId}/${id}`, payload);
  }

  remove(id: string, orgId: string = 'default-org'): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${orgId}/${id}`);
  }
}
