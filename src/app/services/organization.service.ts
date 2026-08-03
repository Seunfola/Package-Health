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

export interface Organization {
  _id: string;
  orgId: string;
  name: string;
  ownerId: string;
}

export interface CreateOrganizationRequest {
  name: string;
}

export interface CreateInvitationRequest {
  email: string;
  role: 'ADMIN' | 'MEMBER';
}

export interface OrgInvitation {
  _id: string;
  orgId: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  createdAt: string;
}

export interface OrgAuditLogEntry {
  _id: string;
  orgId: string;
  action: string;
  actorUserId: string;
  actorEmail?: string;
  target?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private readonly baseUrl = `${environment.apiBaseUrl}/org`;

  constructor(private readonly http: HttpClient) {}

  listMyOrganizations(): Observable<Organization[]> {
    return this.http.get<Organization[]>(this.baseUrl);
  }

  createOrganization(payload: CreateOrganizationRequest): Observable<Organization> {
    return this.http.post<Organization>(this.baseUrl, payload);
  }

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

  createInvitation(orgId: string, payload: CreateInvitationRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/${orgId}/invitations`, payload);
  }

  listInvitations(orgId: string): Observable<OrgInvitation[]> {
    return this.http.get<OrgInvitation[]>(`${this.baseUrl}/${orgId}/invitations`);
  }

  revokeInvitation(orgId: string, invitationId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${orgId}/invitations/${invitationId}`);
  }

  acceptInvitation(token: string): Observable<{ message: string; orgId: string; orgName: string }> {
    return this.http.post<{ message: string; orgId: string; orgName: string }>(`${this.baseUrl}/invitations/accept`, { token });
  }

  getAuditLog(orgId: string): Observable<OrgAuditLogEntry[]> {
    return this.http.get<OrgAuditLogEntry[]>(`${this.baseUrl}/${orgId}/audit-log`);
  }
}
