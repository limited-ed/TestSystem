import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Test } from 'models';
import { Observable } from 'rxjs';

import {ApiConfiguration as conf} from 'app.config';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  http = inject(HttpClient);

  public get():Observable<Test[]>{
    return this.http.get(conf.apiHost+conf.apiEndpoints.test) as Observable<Test[]>;
  }
}
