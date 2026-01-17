import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_CONFIG } from 'app.config.api';
import { Test } from 'models';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class TestService {
  http = inject(HttpClient);
  conf = inject(API_CONFIG);

  public get(): Observable<Test[]> {
    return this.http.get(this.conf.apiHost + this.conf.apiEndpoints.test) as Observable<Test[]>;
  }

  public getForUser(id: number): Observable<Test[]> {
    return this.http.get(this.conf.apiHost + this.conf.apiEndpoints.testForUser) as Observable<Test[]>;
  }

  public post(item: Test): Observable<Test> {
    return this.http.post(this.conf.apiHost + this.conf.apiEndpoints.test, item) as Observable<Test>;
  }
  public put(item: Test): Observable<Test> {
    return this.http.put(this.conf.apiHost + this.conf.apiEndpoints.test + item.id, item) as Observable<Test>;
  }
  public delete(id: number): Observable<any> {
    return this.http.delete(this.conf.apiHost + this.conf.apiEndpoints.test + id) as Observable<any>;
  }
}
