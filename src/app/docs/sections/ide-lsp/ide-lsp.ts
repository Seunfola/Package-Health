import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-doc-ide-lsp',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ide-lsp.html',
  styleUrls: ['../../docs-shared.css'],
  host: { class: 'docs-section glass-panel' },
})
export class DocIdeLsp {}
