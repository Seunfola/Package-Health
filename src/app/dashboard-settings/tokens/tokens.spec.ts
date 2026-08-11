import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { TokensSettings } from './tokens';

describe('TokensSettings', () => {
  let component: TokensSettings;
  let fixture: ComponentFixture<TokensSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokensSettings],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TokensSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
