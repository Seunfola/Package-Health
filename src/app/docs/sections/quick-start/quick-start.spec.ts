import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DocQuickStart } from './quick-start';

describe('DocQuickStart', () => {
  let component: DocQuickStart;
  let fixture: ComponentFixture<DocQuickStart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocQuickStart],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DocQuickStart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
