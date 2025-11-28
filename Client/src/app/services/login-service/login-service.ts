import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthModel } from 'models/auth/authModel';
import { ApplicationStore } from 'state/application-store';


import { API_CONFIG } from 'app.config.api';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  http = inject (HttpClient);
  store = inject(ApplicationStore);
    conf = inject(API_CONFIG);

  public login(model: AuthModel) {
    return this.http.post(this.conf.apiHost+this.conf.apiEndpoints['login'], model)
  }

}
