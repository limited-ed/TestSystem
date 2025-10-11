import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Question } from 'models';
import { Observable } from 'rxjs';

import {ApiConfiguration as conf} from 'app.config';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
    http = inject(HttpClient);

  public get(): Observable<Question[]>{
    return this.http.get(conf.apiHost+conf.apiEndpoints['questions']) as Observable<Question[]>;
  }

  public post(item: Question): Observable<Question>{
    return this.http.post(conf.apiHost+conf.apiEndpoints['questions'], item) as Observable<Question>;
  }
  public put(item: Question): Observable<Question>{
    return this.http.put(conf.apiHost+conf.apiEndpoints['questions'] + item.id, item) as Observable<Question>;
  } 
  public delete(id: number): Observable<never> {
    return this.http.delete(conf.apiHost+conf.apiEndpoints['questions'] +  id) as Observable<never>;
  }
}
