import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Answer, TestResult } from 'models';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AccordionModule } from 'primeng/accordion';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe, Location } from '@angular/common';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-result-details',
  imports: [ScrollPanelModule, AccordionModule, SelectButtonModule, FormsModule, DatePipe, DecimalPipe, ButtonModule],
  templateUrl: './result-details.html',
  styleUrl: './result-details.css',
})
export class ResultDetails implements OnInit {

  id = input.required<number>();

  router = inject(Router);
  location = inject(Location)

  testResult = computed<TestResult>(() => {
    const navigation = this.router.lastSuccessfulNavigation();
    if (navigation?.extras.state) {
      console.log(navigation.extras.state['result']);
      return navigation.extras.state['result'];
    } else {
      return [];
    }
  })

  results = computed(() => {
    if (this.showValue() === 'all') {
      return this.testResult().results;
      
    }
    else {
      return this.testResult().results.filter(f => this.showValue() === 'right' ? f.right === true : f.right === false)
    }
  });

  stateOptions = signal<any[]>([]);

  showValue = signal('all');

  ngOnInit(): void {
    this.stateOptions.set([{ label: 'Все', value: 'all' }, { label: 'Верные', value: 'right' }, { label: 'Неверные', value: 'wrong' }]);
  }

  back(){
    this.location.back();
  }

}
