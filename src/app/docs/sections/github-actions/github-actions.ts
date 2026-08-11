import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-doc-github-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './github-actions.html',
  styleUrls: ['../../docs-shared.css'],
  host: { class: 'docs-section glass-panel' },
})
export class DocGithubActions {}
