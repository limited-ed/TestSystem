import { DatePipe } from '@angular/common';
import { Component, effect, inject, linkedSignal, signal, viewChild } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TestResult } from 'models';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker'
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Menu, MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TestResultService } from 'services/test-result-service/test-result-service';


@Component({
  selector: 'app-results-list',
  imports: [DatePickerModule, FormsModule,
    TableModule, IconFieldModule, InputIconModule,
    ButtonModule, InputTextModule, MenuModule,
    DatePipe],
  templateUrl: './results-list.html',
  styleUrl: './results-list.css'
})
export class ResultsList {
  router = inject(Router);
  srv = inject(TestResultService);

  menu = viewChild<Menu>("menu");

  range = signal<Date[]>([new Date(new Date().valueOf() - 6 * 24 * 60 * 60 * 1000), new Date()]);
  newRange = linkedSignal({
    source: this.range,
    computation: (src, prev) => {
      if (src[1] === null) return undefined; else return src;
    }
  })
  results = rxResource({
    params: this.newRange,
    stream: (params) => {
      let from = (params.params as Date[])[0].toLocaleDateString('ru-RU', { year: 'numeric', day: '2-digit', month: '2-digit' });
      let to = (params.params as Date[])[1].toLocaleDateString('ru-RU', { year: 'numeric', day: '2-digit', month: '2-digit' });
      return this.srv.getAll(from, to);
    }
  });

  selectedResult = signal<TestResult | undefined>(undefined)
  items: MenuItem[] = [
    {
      label: "Подробнее", icon: 'pi pi-info-circle', command: () => {
        this.router.navigate(['/admin/result-detail/' + this.selectedResult()?.userId], { state: { result: this.selectedResult() } });
      }
    },
    { label: "Итоговый протокол", icon: 'pi pi-trash', },
    { separator: true },
    { label: 'Удалить', icon: 'pi pi-trash', iconStyle: { "color": "var(--color-red-600)" } }
  ];

  menuClick(event: any, result: TestResult) {
    this.selectedResult.set(result);
    this.menu()?.toggle(event);
  }

}
