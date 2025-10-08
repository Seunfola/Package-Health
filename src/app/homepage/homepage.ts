import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeroSection } from './hero-section/hero-section';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, HeroSection],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage {

}
