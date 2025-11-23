import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { JwtOptions, provideJwtOptions } from 'core/jwt/jwt.options';
import { ApplicationStore } from 'state/application-store';
import { environment } from '../environments/environment';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from 'core/jwt/';
import { of } from 'rxjs';
import { AppTheme } from 'app.theme';
import { provideReuseStrategy } from 'core/route/app_route_reuse';
import { UserStore } from 'state/user-store';


export const ApiConfiguration = {
  apiEndpoints: {
    login: '/api/login/',
    categories: '/api/category/',
    groups: '/api/group/',
    users: '/api/user/',
    questions: '/api/question/',
    cource: '/api/cource/',
    test: '/api/test/',
    testForUser: '/api/testforuser/',
    startTest: '/api/starttest/',
    endTest: '/api/endtest/'
  },
  apiHost: environment.apiServer
}

const primeOptions = {
  theme: {
    preset: AppTheme,
    options: {
      darkModeSelector: '.dark'
    }
  }
};


//export const API_CONFIG = new InjectionToken<ApiConfiguration>('API_CONFIG');

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
    providePrimeNG(primeOptions)
  ]
};
