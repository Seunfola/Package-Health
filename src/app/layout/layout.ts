import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from '../shared/navbar/navbar';
import { Sidebar } from '../shared/sidebar/sidebar';
import { Footer } from '../shared/footer/footer';
import { css } from '../../../styled-system/css';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar, Sidebar, Footer],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css'],
})
export class Layout {
  layoutClass = css({
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
    backgroundColor: 'gray.50',
  });

  contentWrapperClass = css({
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    minWidth: 0,
  });

  mainContentClass = css({
    flexGrow: 1,
    overflowY: 'auto',
    padding: '16px',
  });
}
