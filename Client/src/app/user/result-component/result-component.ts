import { Component, input } from '@angular/core';
import { Result } from 'models';

@Component({
  selector: 'app-result-component',
  imports: [],
  templateUrl: './result-component.html',
  styleUrl: './result-component.css'
})
export class ResultComponent {

  result=input.required<Result>()

}
