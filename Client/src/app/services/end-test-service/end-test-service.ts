import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_CONFIG } from 'app.config.api';
import { TestResult } from 'models';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class EndTestService {

  http = inject(HttpClient);
  conf = inject(API_CONFIG);

  public put(item: TestResult): Observable<TestResult> {
    return this.http.put(this.conf.apiHost + this.conf.apiEndpoints['endTest'] + item.id, item) as Observable<TestResult>;
  }
}
