import { Component, inject, model, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Test } from 'models';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Menu, MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TestService } from 'services/test-service/test-service';
import { AdministratorStore } from 'state';

@Component({
  selector: 'app-tests-list',
  imports: [ButtonModule, TableModule, MenuModule, ConfirmDialog],
  templateUrl: './tests-list.html',
  styleUrl: './tests-list.css',
  providers: [ConfirmationService]
})
export class TestsList {


  store = inject(AdministratorStore);
  router = inject(Router);
  confirmationService = inject(ConfirmationService);
  service = inject(TestService);

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
    this.router.navigate(['/admin/tests/new'])
  }

  editTest() {
    this.router.navigate(['/admin/tests/view', this.selectedTest()?.id])
  }

  deleteTest(arg0: Test) {
    this.confirmationService.confirm({
      message: 'Удалить вопрос, отменить действие нельзя? ',
      header: 'Подтверждение',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Отмена',
        severity: 'secondary',

      },
      acceptButtonProps: {
        label: 'Удалить',
        severity: 'danger',
        outlined: true,
      },
      accept: () => {
        let a=this.selectedTest()?.id??0
        this.service.delete(a).subscribe({
          next: () => {
            this.store.deleteTest(a);
          }
        });
      }
    });

  }

  showMenu(event: any, test: Test) {
    this.selectedTest.set(test);
    this.menu()?.toggle(event);
  }

}
