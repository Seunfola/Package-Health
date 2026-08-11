import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DocDownloads } from './downloads';

describe('DocDownloads', () => {
  let component: DocDownloads;
  let fixture: ComponentFixture<DocDownloads>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocDownloads],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DocDownloads);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
