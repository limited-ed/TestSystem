import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners, Provider, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { JwtOptions, provideJwtOptions } from 'core/jwt/jwt.options';
import { ApplicationStore } from 'state/application-store';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from 'core/jwt/';
import { of } from 'rxjs';
import { AppTheme } from 'app.theme';
import { provideReuseStrategy } from 'core/route/app_route_reuse';
import { UserStore } from 'state/user-store';
import { ApiConfiguration, provideApiConfig } from 'app.config.api';

import { ru } from 'primelocale/ru.json'


const primeOptions = {
  translation: ru,
  theme: {
    preset: AppTheme,
    options: {
      darkModeSelector: '.dark'
    }
  }
};



const jwtOptions: JwtOptions = {
  blackList: [],
  whiteList: [ApiConfiguration.apiHost],
  getTokenFn: () => {
    const store = inject(ApplicationStore);
    const userStore = inject(UserStore)
    
    let token;
    if (store.user()?.role === 'User' && userStore.mode() === 'testing') {
      token=userStore.testToken();
    } else {
      token = store.token();
    }

    return token;
  },
  refreshTokenFn: () => {
    return of("");
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideJwtOptions(jwtOptions),
    provideHttpClient(withInterceptors([jwtInterceptor]), withFetch()),
    provideRouter(routes, withComponentInputBinding()),
    provideReuseStrategy(),
    provideAnimationsAsync(),
    providePrimeNG(primeOptions),
    provideApiConfig(),
  ]
};
