import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable } from '@angular/core';
import { API_CONFIG } from 'app.config.api';
import { TestResult } from 'models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TestResultService {
 
  http=inject(HttpClient);
  conf=inject(API_CONFIG);

  public getAll(from: string, to: string): Observable<TestResult[]> {
    return this.http.get<TestResult[]>(this.conf.apiHost + this.conf.apiEndpoints.testResult+`?from=${from}&to=${to}`);
  }

  public getUserResults(id:number, page = 1, pageSize = 20): Observable<TestResult[]> {
    return this.http.get<TestResult[]>(this.conf.apiHost + this.conf.apiEndpoints.testResult + id+`/?page=${page}&pagesize=${pageSize}`);
  }
  


}
