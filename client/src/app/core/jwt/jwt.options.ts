import { HttpRequest } from '@angular/common/http';
import { InjectionToken, Provider } from '@angular/core';
import { Observable } from 'rxjs';

export const JWT_OPTIONS = new InjectionToken<JwtOptions>('JWT_OPTIONS');

export class JwtOptions{
    getTokenFn?: () => string | undefined;
    refreshTokenFn?: () => Observable<string>;
    whiteList?: Array<string>;
    blackList?: Array<string>;
}

export function provideJwtOptions(options: JwtOptions):Provider  {
    return {
        provide: JWT_OPTIONS,
        useValue: options
    }
}