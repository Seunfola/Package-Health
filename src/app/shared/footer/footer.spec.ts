import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { Footer } from './footer';

describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders a real link for every entry across all footer columns — no dead titles-only columns', () => {
    const totalLinks = component.footerLinks.reduce((sum, col) => sum + col.links.length, 0);
    const anchors = fixture.nativeElement.querySelectorAll('.footer-nav a');
    expect(anchors.length).toBe(totalLinks);
  });

  it('never renders a placeholder "#" href', () => {
    const anchors: NodeListOf<HTMLAnchorElement> = fixture.nativeElement.querySelectorAll('a');
    anchors.forEach((a) => expect(a.getAttribute('href')).not.toBe('#'));
  });
});
