import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navbar } from '../shared/navbar/navbar';
import { Sidebar } from '../shared/sidebar/sidebar';
import { Footer } from '../shared/footer/footer';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [Navbar, Sidebar, Footer, RouterModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {}
