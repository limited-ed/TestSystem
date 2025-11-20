import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { StartTestInfo } from 'models/start-test-info';
import { Observable } from 'rxjs';

import { ApiConfiguration as conf } from 'app.config';

@Injectable({
  providedIn: 'root'
})
export class StartTestService {

  http = inject(HttpClient);

  public startTest(id: number): Observable<StartTestInfo> {
    return this.http.get(conf.apiHost + conf.apiEndpoints.startTest + id) as Observable<StartTestInfo>;
  }
}
