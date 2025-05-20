import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({
        anchorScrolling: 'enabled',          // jump to #fragment
        scrollPositionRestoration: 'enabled'
    })),
    provideAnimations(),
    provideHttpClient(),
    provideHttpClient(withInterceptorsFromDi())
  ]
};

