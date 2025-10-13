import { Injectable, OnDestroy } from '@angular/core';
import {
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, of, Subscription } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { LoaderService } from './loader';

@Injectable()
export class ProgressInterceptor implements HttpInterceptor, OnDestroy {
  private activeRequests = 0;
  private resetSubscription?: Subscription;

  constructor(private loader: LoaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only reset when the first request starts
    if (this.activeRequests === 0) {
      this.loader.reset();
    }
    this.activeRequests++;

    return next.handle(req).pipe(
      tap({
        next: (event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.Sent:
              this.loader.setProgress(5);
              break;

            case HttpEventType.DownloadProgress:
            case HttpEventType.UploadProgress:
              if (event.total) {
                const percent = Math.round((100 * event.loaded) / event.total);
                this.loader.setProgress(percent);
              }
              break;

            case HttpEventType.Response:
              this.activeRequests--;
              if (this.activeRequests === 0) {
                this.loader.setProgress(100);
                // Clean up any previous delayed reset
                this.resetSubscription?.unsubscribe();
                // Use RxJS delay for automatic cleanup
                this.resetSubscription = of(null)
                  .pipe(
                    delay(800),
                    tap(() => this.loader.reset()),
                  )
                  .subscribe();
              }
              break;
          }
        },
        error: () => {
          // Decrement activeRequests even on failure
          this.activeRequests = Math.max(0, this.activeRequests - 1);
          if (this.activeRequests === 0) {
            this.loader.reset();
          }
        },
      }),
    );
  }

  ngOnDestroy(): void {
    // Prevent resource leaks if interceptor is destroyed
    this.resetSubscription?.unsubscribe();
  }
}
