import { Component } from '@angular/core';

@Component({
  selector: 'app-about-us',
  imports: [],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUs {
  titleClass = {
    fontSize: '2xl',
    fontWeight: 'bold',
    color: 'blue.600',
    marginTop: '4',
  };
}
