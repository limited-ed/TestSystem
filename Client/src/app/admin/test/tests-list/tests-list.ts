import { Component, inject, model, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Test } from 'models';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { AdministratorStore } from 'state';

@Component({
  selector: 'app-tests-list',
  imports:  [ButtonModule, TableModule, MenuModule, ],
  templateUrl: './tests-list.html',
  styleUrl: './tests-list.css'
})
export class TestsList {


  store = inject(AdministratorStore);
  router= inject(Router);

  selectedTest = model<Test>();

  menuItems: MenuItem[] = [
    {
      label: "Редактировать тест", icon: "pi pi-pencil",
      iconStyle: { "color": "var(--color-primary-600)" },
      command: () => {
        this.editTest();
      }
    },
    {
      label: "Удалить тест", icon: "pi pi-trash",
      iconStyle: { "color": "var(--color-red-600)" },
      command: () => {
        this.deleteTest(this.selectedTest()!);
      }
    }
  ];

  menu = viewChild<Menu>("testmenu");

  newTest() {
    
    throw new Error('Method not implemented.');
  }

  editTest() {
    this.router.navigate(['/admin/tests/view', this.selectedTest()?.id])
  }

  deleteTest(arg0: Test) {
    throw new Error('Method not implemented.');
  }

  showMenu(event: any, test: Test){
    this.selectedTest.set(test);
    this.menu()?.toggle(event);
  }

}
