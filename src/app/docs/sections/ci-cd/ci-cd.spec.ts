import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DocCiCd } from './ci-cd';

describe('DocCiCd', () => {
  let component: DocCiCd;
  let fixture: ComponentFixture<DocCiCd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocCiCd],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DocCiCd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
