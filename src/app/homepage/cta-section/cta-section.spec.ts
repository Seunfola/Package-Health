import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CtaSection } from './cta-section';

describe('CtaSection', () => {
  let component: CtaSection;
  let fixture: ComponentFixture<CtaSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CtaSection],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CtaSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
