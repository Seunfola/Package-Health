import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeQualityMetrics } from './code-quality-metrics';

describe('CodeQualityMetrics', () => {
  let component: CodeQualityMetrics;
  let fixture: ComponentFixture<CodeQualityMetrics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeQualityMetrics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeQualityMetrics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
