import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeroSection } from './hero-section/hero-section';
import { Updates } from './updates/updates';
import { FeatureSection } from './feature-section/feature-section';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, HeroSection, Updates, FeatureSection],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage {}
