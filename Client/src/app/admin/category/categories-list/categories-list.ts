import { Component, inject, model, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserEdit } from 'admin/user/user-edit/user-edit';
import { Category, User } from 'models';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { Menu, MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { Observable, throwError, map } from 'rxjs';
import { CategoryService, UserService } from 'services';
import { AdministratorStore, ApplicationStore } from 'state';
import { CategoryEdit } from '../category-edit/category-edit';

@Component({
  selector: 'app-categories-list',
  imports: [TableModule, ButtonModule, MenuModule, InputTextModule, FormsModule],
  providers: [DialogService],
  templateUrl: './categories-list.html',
  styleUrl: './categories-list.css'
})
export class CategoriesList {

  store = inject(AdministratorStore);
  appStore = inject(ApplicationStore);
  service = inject(CategoryService);

  dialogService = inject(DialogService);
  ref: DynamicDialogRef | null = null;

  menuItems: MenuItem[] = [
    {
      label: "Редактировать категорию", icon: "pi pi-pencil", command: (e) => {
        this.editCategory();
      }
    },
    { label: "Удалить категорию", icon: "pi pi-trash" }
  ];

  menu = viewChild<Menu>("catmenu");

  selectedCategory = model<Category>();


  menuClick($event: any, category: Category) {
    this.selectedCategory.set(category);
    this.menu()?.toggle($event)
  }

  private editCategory() {
    this.ref = this.dialogService.open(CategoryEdit, {
      header: 'Редактирование категории',
      inputValues: { category: this.selectedCategory() },
      data: {
        saveData: this.saveData.bind(this)
      },
      width: '50vw',
      modal: true,
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
    });
  }

  saveData(entity: Category): Observable<boolean> {
    if (typeof (entity) === 'undefined') {
      return throwError(() => new Error("Entity is undefined"));
    };
    if (entity.id === 0) {
      return this.service.post(entity).pipe(
        map((data: Category) => {
          this.store.updateCategory(data);
          return true;
        })
      )
    }
    return this.service.put(entity).pipe(
      map((data: Category) => {
        this.store.updateCategory(data);
        return true;
      })
    )
  }

  newCategory(): void {
    this.ref = this.dialogService.open(CategoryEdit, {
      header: 'Редактирование категории',
      inputValues: { category: {id:0, title: ''} as Category },
      data: {
        saveData: this.saveData.bind(this)
      },
      width: '50vw',
      modal: true,
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
    });

  }

}
