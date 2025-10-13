import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoaderService } from './loader';

@Injectable()
export class ProgressInterceptor implements HttpInterceptor {
  constructor(private loader: LoaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loader.reset();

    return next.handle(req).pipe(
      tap((event) => {
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
            this.loader.setProgress(100);
            setTimeout(() => this.loader.reset(), 800);
            break;
        }
      }),
    );
  }
}
