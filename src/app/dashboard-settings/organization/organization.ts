import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingsCard } from '../settings/settings-card/settings-card';
import { OrgContextService } from '../org-context.service';
import { OrganizationService } from '@/app/services/organization.service';

@Component({
  selector: 'app-organization-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, SettingsCard],
  templateUrl: './organization.html',
  styleUrls: ['./organization.css', '../settings-shared.css'],
})
export class OrganizationSettings {
  newOrgName = '';
  isCreatingOrg = false;
  orgSwitcherMessage = '';
  orgSwitcherError = '';

  logoFile: File | null = null;
  isUploadingLogo = false;
  logoMessage = '';
  logoError = '';

  newOwnerEmail = '';
  transferMessage = '';
  isTransferring = false;

  constructor(
    readonly org: OrgContextService,
    private readonly organizationService: OrganizationService,
  ) {}

  switchOrg(orgId: string): void {
    this.org.switchOrg(orgId);
  }

  createOrganization(): void {
    if (!this.newOrgName.trim()) return;
    this.isCreatingOrg = true;
    this.orgSwitcherMessage = '';
    this.orgSwitcherError = '';

    this.organizationService.createOrganization({ name: this.newOrgName.trim() }).subscribe({
      next: (newOrg) => {
        this.isCreatingOrg = false;
        this.newOrgName = '';
        this.orgSwitcherMessage = `Organization "${newOrg.name}" created.`;
        this.org.addOrgAndSwitch(newOrg);
        setTimeout(() => (this.orgSwitcherMessage = ''), 3000);
      },
      error: (err) => {
        console.error('Failed to create organization', err);
        this.isCreatingOrg = false;
        this.orgSwitcherError = err.error?.message || 'Failed to create organization.';
        setTimeout(() => (this.orgSwitcherError = ''), 3000);
      },
    });
  }

  onLogoFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.logoFile = input.files?.[0] ?? null;
  }

  uploadLogo(): void {
    if (!this.logoFile) return;
    this.isUploadingLogo = true;
    this.logoMessage = '';
    this.logoError = '';

    this.organizationService.setLogo(this.org.activeOrgId, this.logoFile).subscribe({
      next: () => {
        this.isUploadingLogo = false;
        this.logoMessage = 'Logo updated.';
        this.logoFile = null;
        this.org.refreshOrgs();
        setTimeout(() => (this.logoMessage = ''), 3000);
      },
      error: (err) => {
        this.isUploadingLogo = false;
        this.logoError = err.error?.message || 'Failed to upload logo.';
      },
    });
  }

  initiateTransfer(): void {
    if (!this.newOwnerEmail) return;
    this.isTransferring = true;
    this.transferMessage = '';

    this.organizationService.initiateTransfer(this.org.activeOrgId, { newOwnerEmail: this.newOwnerEmail }).subscribe({
      next: (res) => {
        this.isTransferring = false;
        // The backend emails the new owner a link to /accept-transfer — there's
        // nothing left for this screen to show beyond its own success message.
        this.transferMessage = res.message;
        this.newOwnerEmail = '';
      },
      error: (err) => {
        console.error('Failed to transfer ownership', err);
        this.isTransferring = false;
        this.transferMessage = err.error?.message || 'Failed to initiate transfer. Does the user exist?';
      },
    });
  }
}
