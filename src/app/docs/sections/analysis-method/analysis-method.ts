import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-doc-analysis-method',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analysis-method.html',
  styleUrls: ['../../docs-shared.css'],
  host: { class: 'docs-section glass-panel' },
})
export class DocAnalysisMethod {}
