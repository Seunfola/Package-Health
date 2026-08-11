import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-doc-ecosystems',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ecosystems.html',
  styleUrls: ['../../docs-shared.css'],
  host: { class: 'docs-section glass-panel' },
})
export class DocEcosystems {}
