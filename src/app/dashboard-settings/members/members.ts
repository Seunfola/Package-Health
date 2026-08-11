import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { SettingsCard } from '../settings/settings-card/settings-card';
import { OrgContextService } from '../org-context.service';
import { OrganizationService, OrganizationMember, OrgInvitation, OrgAuditLogEntry } from '@/app/services/organization.service';

@Component({
  selector: 'app-members-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, SettingsCard],
  templateUrl: './members.html',
  styleUrls: ['./members.css', '../settings-shared.css'],
})
export class MembersSettings implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  members: OrganizationMember[] = [];
  isLoadingMembers = false;
  newMemberEmail = '';
  newMemberRole: 'ADMIN' | 'MEMBER' = 'MEMBER';
  isAddingMember = false;
  memberMessage = '';
  memberError = '';

  // Invitations state (email-based, works even if the invitee has no account yet)
  invitations: OrgInvitation[] = [];
  isLoadingInvitations = false;
  newInviteEmail = '';
  newInviteRole: 'ADMIN' | 'MEMBER' = 'MEMBER';
  isInviting = false;
  inviteMessage = '';
  inviteError = '';

  // Audit log state
  auditLog: OrgAuditLogEntry[] = [];
  isLoadingAuditLog = false;
  auditLogError = '';

  constructor(
    readonly org: OrgContextService,
    private readonly organizationService: OrganizationService,
  ) {}

  ngOnInit(): void {
    this.loadAll();
    this.org.activeOrgId$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.loadAll());
  }

  private loadAll(): void {
    this.loadMembers();
    this.loadInvitations();
    this.loadAuditLog();
  }

  loadMembers(): void {
    this.isLoadingMembers = true;
    this.organizationService.getMembers(this.org.activeOrgId).subscribe({
      next: (members) => {
        this.members = members;
        this.isLoadingMembers = false;
      },
      error: (err) => {
        console.error('Failed to load members', err);
        this.memberError = 'Failed to load organization members.';
        this.isLoadingMembers = false;
      },
    });
  }

  addMember(): void {
    if (!this.newMemberEmail) return;
    this.isAddingMember = true;
    this.memberMessage = '';
    this.memberError = '';

    this.organizationService.addMember(this.org.activeOrgId, { email: this.newMemberEmail, role: this.newMemberRole }).subscribe({
      next: () => {
        this.isAddingMember = false;
        this.memberMessage = 'Member added successfully.';
        this.newMemberEmail = '';
        this.loadMembers();
        setTimeout(() => (this.memberMessage = ''), 3000);
      },
      error: (err) => {
        console.error('Failed to add member', err);
        this.isAddingMember = false;
        this.memberError = err.error?.message || 'Failed to add member.';
        setTimeout(() => (this.memberError = ''), 3000);
      },
    });
  }

  removeMember(userId: string): void {
    if (!confirm('Are you sure you want to remove this member?')) return;

    this.memberMessage = '';
    this.memberError = '';

    this.organizationService.removeMember(this.org.activeOrgId, userId).subscribe({
      next: () => {
        this.memberMessage = 'Member removed successfully.';
        this.loadMembers();
        setTimeout(() => (this.memberMessage = ''), 3000);
      },
      error: (err) => {
        console.error('Failed to remove member', err);
        this.memberError = err.error?.message || 'Failed to remove member.';
        setTimeout(() => (this.memberError = ''), 3000);
      },
    });
  }

  updateRole(userId: string, newRole: 'ADMIN' | 'MEMBER'): void {
    this.memberMessage = '';
    this.memberError = '';

    this.organizationService.updateMemberRole(this.org.activeOrgId, userId, { role: newRole }).subscribe({
      next: () => {
        this.memberMessage = 'Role updated successfully.';
        this.loadMembers();
        setTimeout(() => (this.memberMessage = ''), 3000);
      },
      error: (err) => {
        console.error('Failed to update role', err);
        this.memberError = err.error?.message || 'Failed to update role.';
        this.loadMembers(); // reload to revert select box
        setTimeout(() => (this.memberError = ''), 3000);
      },
    });
  }

  loadInvitations(): void {
    this.isLoadingInvitations = true;
    this.organizationService.listInvitations(this.org.activeOrgId).subscribe({
      next: (invitations) => {
        this.invitations = invitations;
        this.isLoadingInvitations = false;
      },
      error: (err) => {
        console.error('Failed to load invitations', err);
        this.isLoadingInvitations = false;
      },
    });
  }

  sendInvitation(): void {
    if (!this.newInviteEmail) return;
    this.isInviting = true;
    this.inviteMessage = '';
    this.inviteError = '';

    this.organizationService
      .createInvitation(this.org.activeOrgId, { email: this.newInviteEmail, role: this.newInviteRole })
      .subscribe({
        next: () => {
          this.isInviting = false;
          this.inviteMessage = `Invitation sent to ${this.newInviteEmail}.`;
          this.newInviteEmail = '';
          this.loadInvitations();
          setTimeout(() => (this.inviteMessage = ''), 3000);
        },
        error: (err) => {
          console.error('Failed to send invitation', err);
          this.isInviting = false;
          this.inviteError = err.error?.message || 'Failed to send invitation.';
          setTimeout(() => (this.inviteError = ''), 3000);
        },
      });
  }

  revokeInvitation(invitationId: string): void {
    if (!confirm('Revoke this invitation?')) return;

    this.organizationService.revokeInvitation(this.org.activeOrgId, invitationId).subscribe({
      next: () => {
        this.inviteMessage = 'Invitation revoked.';
        this.loadInvitations();
        setTimeout(() => (this.inviteMessage = ''), 3000);
      },
      error: (err) => {
        console.error('Failed to revoke invitation', err);
        this.inviteError = err.error?.message || 'Failed to revoke invitation.';
        setTimeout(() => (this.inviteError = ''), 3000);
      },
    });
  }

  loadAuditLog(): void {
    this.isLoadingAuditLog = true;
    this.auditLogError = '';
    this.organizationService.getAuditLog(this.org.activeOrgId).subscribe({
      next: (entries) => {
        this.auditLog = entries;
        this.isLoadingAuditLog = false;
      },
      error: (err) => {
        // Non-admins get a 403 here (audit log is ADMIN+ only) — that's
        // expected, not an error worth surfacing loudly to a plain member.
        console.error('Failed to load audit log', err);
        this.isLoadingAuditLog = false;
      },
    });
  }

  /** "member.role_changed" -> "Role Changed" for a readable table without a giant switch/lookup map. */
  formatAuditAction(action: string): string {
    const withoutPrefix = action.includes('.') ? action.split('.').slice(1).join(' ') : action;
    return withoutPrefix.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
