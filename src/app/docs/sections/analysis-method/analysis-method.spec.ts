import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocAnalysisMethod } from './analysis-method';

describe('DocAnalysisMethod', () => {
  let component: DocAnalysisMethod;
  let fixture: ComponentFixture<DocAnalysisMethod>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocAnalysisMethod],
    }).compileComponents();

    fixture = TestBed.createComponent(DocAnalysisMethod);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
