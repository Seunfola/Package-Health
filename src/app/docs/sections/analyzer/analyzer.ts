import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-doc-analyzer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analyzer.html',
  styleUrls: ['../../docs-shared.css'],
  host: { class: 'docs-section glass-panel' },
})
export class DocAnalyzer {}
