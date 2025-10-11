import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css',
})
export class HeroSection {
  repository: string = '';

  analyzeRepository() {
    const repo = this.repository.trim();

    if (!repo) {
      alert('Please enter a GitHub repository!');
      return;
    }
    console.log('Repository to analyze:', repo);
  }
}
