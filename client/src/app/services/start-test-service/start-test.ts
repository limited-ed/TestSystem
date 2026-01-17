import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_CONFIG } from 'app.config.api';
import { StartTestInfo } from 'models/start-test-info';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class StartTestService {

  http = inject(HttpClient);
    conf = inject(API_CONFIG);

  public startTest(id: number): Observable<StartTestInfo> {
    return this.http.get(this.conf.apiHost + this.conf.apiEndpoints.startTest + id) as Observable<StartTestInfo>;
  }
}
