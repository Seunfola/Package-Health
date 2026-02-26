import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface StoredUserProfile {
  userName: string;
  userEmail: string;
  userAvatar: string;
  resumeFileName: string;
  profileSummary: string;
  githubUsername: string;
  linkedinProfileUrl: string;
  twitterHandle: string;
  phoneNumber: string;
  location: string;
  skills: string[];
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile {
  private readonly PROFILE_STORAGE_KEY = 'package_health_user_profile';

  userName: string = 'Seun Fola';
  userEmail: string = 'seunfola1@gmail.com';
  userAvatar: string = 'assets/images/C1.jpg';

  resumeFileName: string = '';
  profileSummary: string = '';

  githubUsername: string = '';
  linkedinProfileUrl: string = '';
  twitterHandle: string = '';
  phoneNumber: string = '';
  location: string = '';
  skills: string[] = [];
  statusMessage: string = '';
  statusType: 'success' | 'error' = 'success';

  constructor() {
    this.loadProfile();
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const maxSizeBytes = 2 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      this.setStatus('Resume file exceeds 2MB limit.', 'error');
      return;
    }

    this.resumeFileName = file.name;
    const resumeText = await this.extractTextFromFile(file);
    this.applyParsedResumeData(resumeText);
    this.persistProfile();
    this.setStatus('Resume analyzed and profile updated.', 'success');
  }

  linkGithub(): void {
    this.githubUsername = this.githubUsername.trim().replace(/^@/, '');
    const valid = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(this.githubUsername);
    if (!valid) {
      this.setStatus('Invalid GitHub username format.', 'error');
      return;
    }
    this.persistProfile();
    this.setStatus('GitHub profile linked.', 'success');
  }

  linkLinkedin(): void {
    this.linkedinProfileUrl = this.linkedinProfileUrl.trim();
    if (!/^https:\/\/(www\.)?linkedin\.com\//i.test(this.linkedinProfileUrl)) {
      this.setStatus('LinkedIn URL must start with https://www.linkedin.com/', 'error');
      return;
    }
    this.persistProfile();
    this.setStatus('LinkedIn profile linked.', 'success');
  }

  linkTwitter(): void {
    this.twitterHandle = this.twitterHandle.trim().replace(/^@/, '');
    if (!/^[A-Za-z0-9_]{1,15}$/.test(this.twitterHandle)) {
      this.setStatus('Twitter handle must be 1-15 characters (letters, numbers, underscore).', 'error');
      return;
    }
    this.persistProfile();
    this.setStatus('Twitter account linked.', 'success');
  }

  addSocialLink(): void {
    alert('Adding new social link functionality (not implemented in UI)');
  }

  saveProfile(): void {
    this.persistProfile();
    this.setStatus('Profile saved.', 'success');
  }

  exportProfileFile(): void {
    const profile = this.toStoredProfile();
    const payload = JSON.stringify(profile, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const objectUrl = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = 'user-profile.json';
    anchor.click();

    URL.revokeObjectURL(objectUrl);
  }

  private setStatus(message: string, type: 'success' | 'error'): void {
    this.statusMessage = message;
    this.statusType = type;
  }

  private loadProfile(): void {
    const stored = localStorage.getItem(this.PROFILE_STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as StoredUserProfile;
      this.userName = parsed.userName || this.userName;
      this.userEmail = parsed.userEmail || this.userEmail;
      this.userAvatar = parsed.userAvatar || this.userAvatar;
      this.resumeFileName = parsed.resumeFileName || '';
      this.profileSummary = parsed.profileSummary || '';
      this.githubUsername = parsed.githubUsername || '';
      this.linkedinProfileUrl = parsed.linkedinProfileUrl || '';
      this.twitterHandle = parsed.twitterHandle || '';
      this.phoneNumber = parsed.phoneNumber || '';
      this.location = parsed.location || '';
      this.skills = Array.isArray(parsed.skills) ? parsed.skills : [];
    } catch {
      localStorage.removeItem(this.PROFILE_STORAGE_KEY);
    }
  }

  private persistProfile(): void {
    localStorage.setItem(this.PROFILE_STORAGE_KEY, JSON.stringify(this.toStoredProfile()));
  }

  private toStoredProfile(): StoredUserProfile {
    return {
      userName: this.userName.trim(),
      userEmail: this.userEmail.trim(),
      userAvatar: this.userAvatar,
      resumeFileName: this.resumeFileName,
      profileSummary: this.profileSummary.trim(),
      githubUsername: this.githubUsername.trim(),
      linkedinProfileUrl: this.linkedinProfileUrl.trim(),
      twitterHandle: this.twitterHandle.trim(),
      phoneNumber: this.phoneNumber.trim(),
      location: this.location.trim(),
      skills: this.skills,
    };
  }

  private async extractTextFromFile(file: File): Promise<string> {
    const lowerName = file.name.toLowerCase();
    if (lowerName.endsWith('.txt') || lowerName.endsWith('.md') || lowerName.endsWith('.json')) {
      return file.text();
    }

    if (lowerName.endsWith('.pdf')) {
      const bytes = new Uint8Array(await file.arrayBuffer());
      return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    }

    return '';
  }

  private applyParsedResumeData(text: string): void {
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (!this.userName || this.userName === 'Seun Fola') {
      const probableName = lines.find((line) => /^[A-Za-z][A-Za-z\s.'-]{2,50}$/.test(line));
      if (probableName) {
        this.userName = probableName;
      }
    }

    const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    if (emailMatch) this.userEmail = emailMatch[0];

    const phoneMatch = text.match(
      /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}/,
    );
    if (phoneMatch) this.phoneNumber = phoneMatch[0];

    const linkedInMatch = text.match(/https?:\/\/(?:www\.)?linkedin\.com\/[^\s)]+/i);
    if (linkedInMatch) this.linkedinProfileUrl = linkedInMatch[0];

    const githubMatch = text.match(/https?:\/\/(?:www\.)?github\.com\/([A-Za-z0-9-]+)/i);
    if (githubMatch) this.githubUsername = githubMatch[1];

    const summaryLine = lines.find((line) => line.length >= 40 && line.length <= 220);
    if (summaryLine) this.profileSummary = summaryLine;

    const locationLine = lines.find((line) =>
      /(remote|usa|united states|new york|california|texas|lagos|london|toronto)/i.test(line),
    );
    if (locationLine) this.location = locationLine;

    const skillKeywords = [
      'Angular',
      'TypeScript',
      'JavaScript',
      'Node.js',
      'React',
      'Python',
      'AWS',
      'Docker',
      'Kubernetes',
      'SQL',
      'PostgreSQL',
      'Git',
      'CI/CD',
      'Jest',
    ];

    this.skills = skillKeywords.filter((keyword) =>
      new RegExp(`\\b${keyword.replace('/', '\\/')}\\b`, 'i').test(text),
    );
  }
}
