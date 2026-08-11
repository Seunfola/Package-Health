import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HowItWorksPage } from './how-it-works';

describe('HowItWorksPage', () => {
  let component: HowItWorksPage;
  let fixture: ComponentFixture<HowItWorksPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowItWorksPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HowItWorksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
