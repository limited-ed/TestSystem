import { inject, Injectable } from '@angular/core';
import { Category } from 'models';
import { Observable } from 'rxjs';


import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from 'app.config.api';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  http = inject(HttpClient);
  conf = inject(API_CONFIG);

  public get(): Observable<Category[]> {
    return this.http.get(this.conf.apiHost + this.conf.apiEndpoints['categories']) as Observable<Category[]>;
  }

  public post(entity: Category): Observable<Category> {
    return this.http.post(this.conf.apiHost + this.conf.apiEndpoints['categories'], entity) as Observable<Category>;
  }

  public put(entity: Category): Observable<Category> {
    let endpoint = this.conf.apiHost + this.conf.apiEndpoints['categories'] + `${entity.id}`;
    return this.http.put(endpoint, entity) as Observable<Category>;
  }

  public delete(id: number): Observable<Object> {
    return this.http.delete(this.conf.apiHost + this.conf.apiEndpoints['categories'] + `/${id}`) as Observable<object>;
  }

}
