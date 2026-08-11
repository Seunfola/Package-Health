import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { WebhooksSettings } from './webhooks';

describe('WebhooksSettings', () => {
  let component: WebhooksSettings;
  let fixture: ComponentFixture<WebhooksSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebhooksSettings],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(WebhooksSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
