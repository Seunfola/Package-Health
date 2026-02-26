import { TestBed } from '@angular/core/testing';
import { ProgressInterceptor } from './progress-interceptor';
import { LoaderService } from './loader';

describe('ProgressInterceptor', () => {
  let interceptor: ProgressInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    interceptor = new ProgressInterceptor(TestBed.inject(LoaderService));
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
