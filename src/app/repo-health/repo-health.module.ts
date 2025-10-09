import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusCard } from '../reusable/status-card/status-card';


@NgModule({
  declarations: [],
  imports: [CommonModule,StatusCard ],
  exports: [StatusCard],
})
export class RepoHealthModule {}
