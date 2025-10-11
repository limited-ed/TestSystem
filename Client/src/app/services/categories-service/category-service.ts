import { inject, Injectable } from '@angular/core';
import { Category } from 'models';
import { Observable } from 'rxjs';

import {ApiConfiguration as conf} from 'app.config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
    http = inject(HttpClient);

  public get(): Observable<Category[]>{
    return this.http.get(conf.apiHost+conf.apiEndpoints['categories']) as Observable<Category[]>;
  }

  public post(entity: Category): Observable<Category>{
    return this.http.post(conf.apiHost+conf.apiEndpoints['categories'], entity) as Observable<Category>;
  }

  public put(entity: Category): Observable<Category>{
    let endpoint= conf.apiHost+conf.apiEndpoints['categories'] + `${entity.id}`;
    return this.http.put(endpoint, entity) as Observable<Category>;
  }

  public delete(id: number): Observable<Object>{
    return this.http.delete(conf.apiHost+conf.apiEndpoints['categories'] + `/${id}`) as Observable<object>;
  }

}
