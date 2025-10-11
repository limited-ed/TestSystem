import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Group } from 'models';
import { Observable } from 'rxjs';

import {ApiConfiguration as conf} from 'app.config';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  http = inject(HttpClient);

  public get(): Observable<Group[]>{
    return this.http.get(conf.apiHost+conf.apiEndpoints['groups']) as Observable<Group[]>;
  }

}
