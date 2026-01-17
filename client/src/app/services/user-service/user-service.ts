import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_CONFIG } from 'app.config.api';

import { User } from 'models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  http = inject(HttpClient);
  conf = inject(API_CONFIG);

  public get(): Observable<User[]> {
    return this.http.get(this.conf.apiHost + this.conf.apiEndpoints['users']) as Observable<User[]>;
  }

  public post(entity: User): Observable<User> {
    return this.http.post(this.conf.apiHost + this.conf.apiEndpoints['users'], entity) as Observable<User>;
  }

  public put(entity: User): Observable<User> {
    let endpoint = this.conf.apiHost + this.conf.apiEndpoints['users'] + `${entity.id}`;
    return this.http.put(endpoint, entity) as Observable<User>;
  }

  public delete(id: number): Observable<Object> {
    return this.http.delete(this.conf.apiHost + this.conf.apiEndpoints['users'] + `/${id}`) as Observable<object>;
  }

}
