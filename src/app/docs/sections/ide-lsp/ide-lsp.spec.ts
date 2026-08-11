import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DocIdeLsp } from './ide-lsp';

describe('DocIdeLsp', () => {
  let component: DocIdeLsp;
  let fixture: ComponentFixture<DocIdeLsp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocIdeLsp],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DocIdeLsp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
