import { DatePipe } from '@angular/common';
import { Component, effect, inject, input, signal, viewChild } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { TestResult } from 'models';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { TestResultService } from 'services/test-result-service/test-result-service';

@Component({
  selector: 'app-user-result',
  imports: [TableModule, ButtonModule, MenuModule, PaginatorModule, DatePipe],
  templateUrl: './user-result.html',
  styleUrl: './user-result.css',
})
export class UserResult {

  id = input.required<number>();
  srv = inject(TestResultService)
  router = inject(Router);

  menu = viewChild<Menu>("menu");

  selectedResult = signal<TestResult | undefined>(undefined);

  results = rxResource({
    params: this.id,
    stream: ({ params }) => this.srv.getUserResults(params)
  });

  items: MenuItem[] = [
    { label: "Подробнее", icon: 'pi pi-info-circle',  command: () => {
      this.router.navigate(['/admin/result-detail/'+this.id().toString()], {state:{result: this.selectedResult()}});
    }},
    { label: "Итоговый протокол", icon: 'pi pi-trash', },
    { separator: true },
    { label: 'Удалить', icon: 'pi pi-trash', iconStyle: { "color": "var(--color-red-600)" } }
  ];

  menuClick($event: any, result: TestResult): void {
    this.selectedResult.set(result);
    this.menu()?.toggle($event);
  }
}
