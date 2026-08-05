import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  repository: string;
  isRead: boolean;
  createdAt: string;
  iconType: string;
}

export interface NotificationResponse {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  repository?: string;
  severity: string;
  isRead: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly API_URL = `${environment.apiBaseUrl}/notifications`;

  constructor(private readonly http: HttpClient) {}

  getNotifications(limit: number = 20): Observable<NotificationResponse[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<NotificationResponse[]>(this.API_URL, { params });
  }

  markAsRead(id: string): Observable<NotificationResponse> {
    return this.http.post<NotificationResponse>(`${this.API_URL}/${id}/read`, {});
  }

  markAllAsRead(): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/read-all`, {});
  }
}
