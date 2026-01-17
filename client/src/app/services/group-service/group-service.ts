import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_CONFIG } from 'app.config.api';
import { Group } from 'models';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class GroupService {

  http = inject(HttpClient);
  conf = inject(API_CONFIG);

  public get(): Observable<Group[]> {
    return this.http.get(this.conf.apiHost + this.conf.apiEndpoints['groups']) as Observable<Group[]>;
  }

  public post<Group>(group: Group): Observable<Group> {
    return this.http.post(this.conf.apiHost + this.conf.apiEndpoints['groups'], group) as Observable<Group>;
  }

  public put(group: Group): Observable<Group> {
    return this.http.put(this.conf.apiHost + this.conf.apiEndpoints['groups'] + group.id, group) as Observable<Group>;
  }

  public delete(group: Group){
    return this.http.delete(this.conf.apiHost + this.conf.apiEndpoints['groups'] + group.id);
  }
}
