import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthModel } from 'models/auth/authModel';
import { ApplicationStore } from 'state/application-store';

import {ApiConfiguration as conf} from 'app.config';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  http = inject (HttpClient);
  store = inject(ApplicationStore);

  public login(model: AuthModel) {
    return this.http.post(conf.apiHost+conf.apiEndpoints['login'], model)
  }

}
