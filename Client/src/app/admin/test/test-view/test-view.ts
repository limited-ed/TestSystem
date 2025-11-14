import { Component, computed, inject, input, linkedSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { deepClone } from 'core';
import { Test, TestPart } from 'models';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { AdministratorStore } from 'state';
import { TestAddCategory } from '../test-add-category/test-add-category';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageBus } from 'core/message-bus/message-bus';

@Component({
  selector: 'app-test-view',
  imports: [TabsModule, ButtonModule, InputTextModule, TableModule, InputNumber, FormsModule, TableModule, ToastModule],
  templateUrl: './test-view.html',
  styleUrl: './test-view.css',
  providers: [DialogService, MessageService]
})
export class TestView {

  id = input<number>();


  msgSrv = inject(MessageBus);
  router = inject(Router);
  store = inject(AdministratorStore);
  dialogService = inject(DialogService);
  ref: DynamicDialogRef | null = null;


  editTest = linkedSignal<Test>(() => {
    let t;
    if (this.id() != undefined) {
      t = this.store.testsEntities().find(f => f.id == this.id())
      if (!!t) {
        t = deepClone(t);
      }
    }
    return t ?? { id: 0, parts: new Array<TestPart>(), timer: 0, title: 'Название теста' } as Test;
  });

  categories = linkedSignal(() => this.store.categoriesEntities().filter(f => !this.editTest().parts.map(m => m.categoryId).includes(f.id)));

  save() {
    this.msgSrv.send({ severity: 'error', summary: 'Ошибка', detail: 'Ошибка при загрузке данных', sticky: true });
  }

  cancel() {
    this.router.navigateByUrl('/admin/tests/list', { replaceUrl: true })
  }

  addCategory() {
    if (this.categories().length === 0) {
      this.msgSrv.send({ severity: 'warn', summary: 'Все категории добавлены',detail: 'Все возможные категории добавлены в тест', sticky: true });
      return;
    }
    this.ref = this.dialogService.open(TestAddCategory, {
      header: 'Добавить категорию в тест',
      inputValues: { categories: this.categories(), editPart: { testId: this.editTest().id, id: 0, count: 0 } as TestPart },
      data: {
        save: (part: TestPart) => {
          this.editTest().parts.push(part);
          this.store.updateTest(this.editTest());
          return of(true);
        }
      },
      width: '30vw',
      modal: true,
      closable: true,
      breakpoints: {
        '1500px': '40vw',
        '1200px': '50vw',
        '900px': '60vw'
      },
    });
  }

}
