import { Component, inject, input, linkedSignal } from '@angular/core';
import { Router } from '@angular/router';
import { Test, TestPart } from 'models';
import { ButtonModule } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { AdministratorStore } from 'state';

@Component({
  selector: 'app-test-view',
  imports: [TabsModule, ButtonModule, InputTextModule, TableModule, InputNumber],
  templateUrl: './test-view.html',
  styleUrl: './test-view.css'
})
export class TestView {

  id = input<number>();

  router = inject(Router);
  store = inject(AdministratorStore);

  editTest = linkedSignal<Test>(() => {
    let t;
    if (this.id() != undefined) {
      t = this.store.testsEntities().find(f => f.id == this.id())
    }
    return t??{ id: 0, parts: new Array<TestPart>(), timer: 0, title: '' } as Test;
  });

cancel() {
  this.router.navigateByUrl('/admin/tests/list', { replaceUrl: true })
}

}
