import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeroSection } from './hero-section/hero-section';
import { Updates } from './updates/updates';
import { FeatureSection } from './feature-section/feature-section';
import { AboutSection } from './about-section/about-section';
import { CtaSection } from './cta-section/cta-section';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, HeroSection, AboutSection, Updates, FeatureSection, CtaSection],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage {}
