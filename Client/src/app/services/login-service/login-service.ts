import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthModel } from 'models/auth/authModel';
import { ApplicationStore } from 'state/application-store';

import { API_CONFIG } from 'app.config.api';
import { catchError, map, Observable, throwError } from 'rxjs';
import { jwtDecode } from 'core';
import { UserInfo } from 'models';

interface AuthResponse {
  token: string,
  publicKey: string
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  http = inject(HttpClient);
  store = inject(ApplicationStore);
  conf = inject(API_CONFIG);

  public login(model: AuthModel): Observable<UserInfo> {
    return this.http.post<AuthResponse>(this.conf.apiHost + this.conf.apiEndpoints['login'], model).pipe(
      map((response) => {
        this.store.updateToken(response.token);
        let decoded = jwtDecode(response.token);
        let user: UserInfo = {
          login: decoded["unique_name"],
          fullname: decoded["fullName"],
          role: decoded["role"],
          id: decoded["userId"],
          canDelete: decoded["canDelete"],
          group: decoded["group"]
        }
        this.store.updateIsLogin(true);
        this.store.updateUser(user);
        return user;
      })
    )
  }

}
