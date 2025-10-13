import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../loader';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-loader.html',
  styleUrl: './app-loader.css',
})
export class AppLoader implements OnInit {
  progress = 0;

  constructor(private Loader: LoaderService) {}

  ngOnInit() {
    this.Loader.progress$.subscribe((value) => (this.progress = value));
  }
}
