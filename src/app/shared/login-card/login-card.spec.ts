import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { LoginCard } from './login-card';

describe('LoginCard', () => {
  let component: LoginCard;
  let fixture: ComponentFixture<LoginCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginCard],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
