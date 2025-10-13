import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoaderService } from '../loader';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-loader.html',
  styleUrl: './app-loader.css',
})
export class AppLoader implements OnInit, OnDestroy {
  progress = 0;
  private subscription?: Subscription;

  constructor(private loader: LoaderService) {}

  ngOnInit() {
    this.subscription = this.loader.progress$.subscribe((value) => {
      this.progress = value;
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
