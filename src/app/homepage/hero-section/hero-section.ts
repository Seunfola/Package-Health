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
  jsonContent: string = '';
  selectedFileName: string = 'No file chosen';
  activeTab: string = 'github';

  setActiveTab(tab: 'github' | 'json' | 'upload'): void {
    this.activeTab = tab;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFileName = input.files[0].name;
      // You can add logic here to read the file content if needed
      console.log('Selected file:', this.selectedFileName);
    } else {
      this.selectedFileName = 'No file chosen';
    }
  }

  analyzeData() {
    switch (this.activeTab) {
      case 'github':
        this.analyzeRepository();
        break;
      case 'paste':
        this.analyzePastedJson();
        break;
      case 'upload':
        this.analyzeUploadedFile();
        break;
    }
  }

  analyzeRepository() {
    const repo = this.repository.trim();

    if (!repo) {
      alert('Please enter a GitHub repository!');
      return;
    }
    console.log('Repository to analyze:', repo);
  }

  analyzePastedJson() {
    try {
      if (!this.jsonContent.trim()) {
        alert('Please paste some JSON content!');
        return;
      }
      const data = JSON.parse(this.jsonContent);
      console.log('Pasted JSON to analyze:', data);
    } catch (e) {
      alert('Invalid JSON content. Please check your syntax.');
    }
  }

  analyzeUploadedFile() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const uploadedFile = fileInput && fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;

    if (!uploadedFile) {
      alert('Please choose a JSON file to upload!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        console.log('Uploaded JSON to analyze:', data);
      } catch (e) {
        alert('Invalid JSON file. Please ensure the file contains valid JSON.');
      }
    };
    reader.readAsText(uploadedFile);
  }
}
