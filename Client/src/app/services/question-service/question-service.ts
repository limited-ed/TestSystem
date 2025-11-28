import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Question } from 'models';
import { Observable } from 'rxjs';


import { API_CONFIG } from 'app.config.api';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  http = inject(HttpClient);
  conf = inject(API_CONFIG);

  public get(): Observable<Question[]> {
    return this.http.get(this.conf.apiHost + this.conf.apiEndpoints['questions']) as Observable<Question[]>;
  }

  public post(item: Question): Observable<Question> {
    return this.http.post(this.conf.apiHost + this.conf.apiEndpoints['questions'], item) as Observable<Question>;
  }
  public put(item: Question): Observable<Question> {
    return this.http.put(this.conf.apiHost + this.conf.apiEndpoints['questions'] + item.id, item) as Observable<Question>;
  }
  public delete(id: number): Observable<never> {
    return this.http.delete(this.conf.apiHost + this.conf.apiEndpoints['questions'] + id) as Observable<never>;
  }
}
