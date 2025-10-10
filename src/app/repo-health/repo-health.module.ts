import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusCard } from '../reusable/status-card/status-card';
import { CommitActivityChart } from '../reusable/charts/commit-activity-chart/commit-activity-chart';
import { DependencyUpdateChart } from '../reusable/charts/dependency-update-chart/dependency-update-chart';
import { IssueResolutionChart } from '../reusable/charts/issue-resolution-chart/issue-resolution-chart';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StatusCard,
    CommitActivityChart,
    DependencyUpdateChart,
    IssueResolutionChart,
  ],
  exports: [StatusCard],
})
export class RepoHealthModule {}
