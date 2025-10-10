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
  @Input() repoName: string = 'PackageHealth/react-dashboard';
  @Input() stars: number = 12450;
  @Input() forks: number = 3200;
  @Input() lastCommit: string = '2 days ago';
  @Input() openChecks: number = 157;

  @Input() starIconPath: string = 'assets/icons/star.svg';
  @Input() forkIconPath: string = 'assets/icons/gitfork.svg';
  @Input() commitIconPath: string = 'assets/icons/clock.svg';
  @Input() checkIconPath: string = 'assets/icons/check.svg';
}
