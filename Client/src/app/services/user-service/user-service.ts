import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import {ApiConfiguration as conf} from 'app.config';
import { User } from 'models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  http = inject(HttpClient);

  public get(): Observable<User[]>{
    return this.http.get(conf.apiHost+conf.apiEndpoints['users']) as Observable<User[]>;
  }

  public post(entity: User): Observable<User>{
    return this.http.post(conf.apiHost+conf.apiEndpoints['users'], entity) as Observable<User>;
  }

  public put(entity: User): Observable<User>{
    let endpoint= conf.apiHost+conf.apiEndpoints['users'] + `${entity.id}`;
    return this.http.put(endpoint, entity) as Observable<User>;
  }

  public delete(id: number): Observable<Object>{
    return this.http.delete(conf.apiHost+conf.apiEndpoints['users'] + `/${id}`) as Observable<object>;
  }

}
