import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
  withFetch,
} from '@angular/common/http';

import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { ProgressInterceptor } from './loader/progress-interceptor';
import { LoaderService } from './loader/loader';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: ProgressInterceptor, multi: true },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
