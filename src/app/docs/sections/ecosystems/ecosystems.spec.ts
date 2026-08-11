import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocEcosystems } from './ecosystems';

describe('DocEcosystems', () => {
  let component: DocEcosystems;
  let fixture: ComponentFixture<DocEcosystems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocEcosystems],
    }).compileComponents();

    fixture = TestBed.createComponent(DocEcosystems);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
