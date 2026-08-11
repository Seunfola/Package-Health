import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-doc-mcp-server',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mcp-server.html',
  styleUrls: ['../../docs-shared.css'],
  host: { class: 'docs-section glass-panel' },
})
export class DocMcpServer {}
