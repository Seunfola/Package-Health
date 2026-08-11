import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { MembersSettings } from './members';

describe('MembersSettings', () => {
  let component: MembersSettings;
  let fixture: ComponentFixture<MembersSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembersSettings],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MembersSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
