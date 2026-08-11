import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { OnboardingWizard } from './onboarding';

describe('OnboardingWizard', () => {
  let component: OnboardingWizard;
  let fixture: ComponentFixture<OnboardingWizard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardingWizard],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(OnboardingWizard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts on step 1', () => {
    expect(component.step).toBe(1);
  });

  it('advances and retreats through next()/back()', () => {
    component.next();
    expect(component.step).toBe(2);
    component.back();
    expect(component.step).toBe(1);
  });

  it('goTo() only allows jumping backward, not forward', () => {
    component.next(); // step 2
    component.goTo(4);
    expect(component.step).toBe(2);
    component.goTo(1);
    expect(component.step).toBe(1);
  });
});
