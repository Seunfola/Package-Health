import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  standalone: true,
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  currentYear: number = new Date().getFullYear();

  footerLinks = [
    { title: 'Company' },
    // { title: 'Product'},
    // { title: 'Resources' },
  ];
}
