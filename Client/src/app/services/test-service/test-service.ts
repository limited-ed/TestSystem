import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Test } from 'models';
import { Observable } from 'rxjs';

import { ApiConfiguration as conf } from 'app.config';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  http = inject(HttpClient);

  public get(): Observable<Test[]> {
    return this.http.get(conf.apiHost + conf.apiEndpoints.test) as Observable<Test[]>;
  }

  public getForUser(id: number): Observable<Test[]> {
    return this.http.get(conf.apiHost + conf.apiEndpoints.testForUser) as Observable<Test[]>;
  }

  public post(item: Test): Observable<Test> {
    return this.http.post(conf.apiHost + conf.apiEndpoints.test, item) as Observable<Test>;
  }
  public put(item: Test): Observable<Test> {
    return this.http.put(conf.apiHost + conf.apiEndpoints.test + item.id, item) as Observable<Test>;
  }
  public delete(id: number): Observable<any> {
    return this.http.delete(conf.apiHost + conf.apiEndpoints.test + id) as Observable<any>;
  }
}
