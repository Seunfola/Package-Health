import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DocLeakguard } from './leakguard';

describe('DocLeakguard', () => {
  let component: DocLeakguard;
  let fixture: ComponentFixture<DocLeakguard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocLeakguard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DocLeakguard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
