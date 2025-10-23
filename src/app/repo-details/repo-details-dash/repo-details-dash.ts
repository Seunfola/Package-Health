import { NumberFormatPipe } from '@/app/shared/number-format-pipe';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-repo-details-dash',
  standalone: true,
  imports: [CommonModule, NumberFormatPipe],
  templateUrl: './repo-details-dash.html',
  styleUrl: './repo-details-dash.css',
})
export class RepoDetailsDash {
  @Input() repoName: string = '';
  @Input() stars: number = 0;
  @Input() forks: number = 0;
  @Input() lastCommit: string = '';
  @Input() openChecks: number = 0;
  @Input() overallHealth: any = null;

  starIconPath: string = 'assets/icons/star.svg';
  forkIconPath: string = 'assets/icons/gitfork.svg';
  commitIconPath: string = 'assets/icons/clock.svg';
  checkIconPath: string = 'assets/icons/check.svg';
}
