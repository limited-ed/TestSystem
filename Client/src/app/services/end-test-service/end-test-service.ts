import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TestResult } from 'models';
import { Observable } from 'rxjs';
import {ApiConfiguration as conf} from 'app.config';

@Injectable({
  providedIn: 'root',
})
export class EndTestService {
  
  http = inject (HttpClient);

  public put(item: TestResult): Observable<TestResult> {
    return this.http.put(conf.apiHost+conf.apiEndpoints['endTest'] + item.id, item) as Observable<TestResult>;
  }
}
