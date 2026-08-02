import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

export interface TransferOwnershipRequest {
  newOwnerEmail: string;
}

export interface AcceptTransferRequest {
  transferToken: string;
}

export interface TransferResponse {
  message: string;
  transferToken?: string;
}

export interface OrganizationMember {
  userId: {
    _id: string;
    email: string;
    name?: string;
  };
  role: 'ADMIN' | 'MEMBER';
}

export interface AddMemberRequest {
  email: string;
  role: 'ADMIN' | 'MEMBER';
}

export interface UpdateRoleRequest {
  role: 'ADMIN' | 'MEMBER';
}

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private readonly baseUrl = `${environment.apiBaseUrl}/org`;

  constructor(private readonly http: HttpClient) {}

  initiateTransfer(orgId: string, payload: TransferOwnershipRequest): Observable<TransferResponse> {
    return this.http.post<TransferResponse>(`${this.baseUrl}/${orgId}/transfer-ownership`, payload);
  }

  acceptTransfer(orgId: string, payload: AcceptTransferRequest): Observable<TransferResponse> {
    return this.http.post<TransferResponse>(`${this.baseUrl}/${orgId}/accept-transfer`, payload);
  }

  getMembers(orgId: string): Observable<OrganizationMember[]> {
    return this.http.get<OrganizationMember[]>(`${this.baseUrl}/${orgId}/members`);
  }

  addMember(orgId: string, payload: AddMemberRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/${orgId}/members`, payload);
  }

  removeMember(orgId: string, userId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${orgId}/members/${userId}`);
  }

  updateMemberRole(orgId: string, userId: string, payload: UpdateRoleRequest): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.baseUrl}/${orgId}/members/${userId}/role`, payload);
  }
}
