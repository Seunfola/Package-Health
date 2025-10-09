import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar {
  @Output() toggleSidebar = new EventEmitter<void>();
  showSearch = false;

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }
}
