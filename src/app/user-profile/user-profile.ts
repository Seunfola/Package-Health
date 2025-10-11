import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile {
  userName: string = 'Seun Fola';
  userEmail: string = 'seunfola1@gmail.com';
  userAvatar: string = 'assets/images/C1.jpg';

  resumeFileName: string = '';

  githubUsername: string = '';
  linkedinProfileUrl: string = '';
  twitterHandle: string = '';

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.resumeFileName = file.name;
      console.log('Resume selected:', this.resumeFileName);
    }
  }

  linkGithub(): void {
    console.log('Linking GitHub with username:', this.githubUsername);
  }

  linkLinkedin(): void {
    console.log('Linking LinkedIn with URL:', this.linkedinProfileUrl);
  }

  linkTwitter(): void {
    console.log('Linking Twitter with handle:', this.twitterHandle);
  }

  addSocialLink(): void {
    alert('Adding new social link functionality (not implemented in UI)');
  }
}
