import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptor, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, tap, throwError } from "rxjs";
import { JwtHelperService } from "./jwt-helper.service";
import { JWT_OPTIONS, JwtOptions } from "./jwt.options";



function isInWhitelist(options: JwtOptions, url: string): boolean {
  let flag = false;
  options.whiteList?.forEach(f => {
    if (url.includes(f)) flag = true;
  });
  return flag;
}

function isInBlacklist(options: JwtOptions, url: string): boolean {
  let flag = false;
  options.blackList?.forEach(f => {
    if (url.includes(f)) flag = true;
  });
  return flag;
}

var isRefreshing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  var token;
  const jwtHelper = inject(JwtHelperService);
  let options: JwtOptions = inject(JWT_OPTIONS)

  if (!options && !jwtHelper) {
    return next(req);
  }

  const isAuthOrRoot = req.url.includes('auth');
  if (options.getTokenFn) {
    token = options.getTokenFn();
    if (!token) {
      return next(req);
    }
  }
  else {
    return next(req);
  }

  if (isInWhitelist(options, req.url) && !isInBlacklist(options, req.url)) {
    if (jwtHelper.isTokenExpired(token, 120)) {
      return refreshToken(req, next);
    };
    req = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req
  }

  return next(req).pipe(
    catchError(err => {
      return throwError(() => err);
    })
  );
}

function refreshToken(req: HttpRequest<any>, next: HttpHandlerFn) {
  const jwtHelper = inject(JwtHelperService);
  const options = inject(JWT_OPTIONS)

  if (!isRefreshing$.getValue()) {
    if (!options.refreshTokenFn) { return throwError(() => new Error('Refresh function catn`t be null')) }

    return options.refreshTokenFn().pipe(
      tap(ref => {
        isRefreshing$.next(false);
      }),
      switchMap(token => {
        req = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });
        return next(req);
      }),
      catchError(err => {
        return throwError(() => err);
      })
    );
  }

  return isRefreshing$.pipe(
    filter((is) => !is),
    take(1),
    switchMap(() => {
      if (!options.getTokenFn) { return throwError(() => new Error('Refresh function catn`t be null')) }
      const token = options.getTokenFn()
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next(req);
    })
  )
}
