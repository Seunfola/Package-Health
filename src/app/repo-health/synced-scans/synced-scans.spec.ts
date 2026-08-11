import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { SyncedScans } from './synced-scans';

describe('SyncedScans', () => {
  let component: SyncedScans;
  let fixture: ComponentFixture<SyncedScans>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyncedScans],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SyncedScans);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
