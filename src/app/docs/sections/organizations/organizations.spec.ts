import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DocOrganizations } from './organizations';

describe('DocOrganizations', () => {
  let component: DocOrganizations;
  let fixture: ComponentFixture<DocOrganizations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocOrganizations],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DocOrganizations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
