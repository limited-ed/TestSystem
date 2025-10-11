import { UserEdit } from 'admin/user/user-edit/user-edit';
import { Group, User } from 'models';

import { MenuItem, TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Menu, MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TreeModule } from 'primeng/tree';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';

import { map, Observable, throwError } from 'rxjs';

import { UserService } from 'services';
import { AdministratorStore, ApplicationStore } from 'state';

import {
  Component, computed, effect, inject, linkedSignal, model, signal, viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users-list',
  imports: [TreeModule, TableModule, ButtonModule, MenuModule, InputIcon, IconField, InputTextModule, AutoCompleteModule, FormsModule],
  providers: [DialogService],
  templateUrl: './users-list.html',
  styleUrl: './users-list.css'
})



export class UsersList {

  store = inject(AdministratorStore);
  appStore = inject(ApplicationStore);
  service = inject(UserService);

  dialogService = inject(DialogService);
  ref: DynamicDialogRef | null = null;

  treeNodes = signal<TreeNode[]>([]);

  selectedGroup = model<TreeNode>();

  users = linkedSignal(() => this.store.usersEntities().filter(f => f.groupId === this.selectedGroup()?.data.id))

  searchQuery = model<string>();
  searchedUsers = signal<any[]>([])

  menu = viewChild<Menu>("menu");

  selectedUser = signal<User | undefined>(undefined);

  items = computed<MenuItem[]>(() => {
    if (this.appStore.user()?.role == "Administrator") {
      return [
        { label: "Просмотр результатов", icon: "pi pi-list-check" },
        { separator: true },
        {
          label: 'Редактировать', icon: 'pi pi-user-edit', iconStyle: { "color": "var(--color-green-600)" },
          command: (event) => {
            this.editUser();
          }
        },
        { label: 'Сменить пароль', icon: 'pi pi-key', iconStyle: { "color": "var(--color-blue-600)" }, },
        { separator: true },
        { label: 'Удалить', icon: 'pi pi-trash', iconStyle: { "color": "var(--color-red-600)" } }

      ];
    } else {
      return [
        { label: "Просмотр результатов", icon: "pi pi-list-check" },
        { separator: true },
        { label: 'Сменить пароль', icon: 'pi pi-key', iconStyle: { "color": "var(--color-blue-600)" }, },
      ];
    }

  });

  constructor() {
    effect(() => {
      let groups = this.store.groupsEntities().filter(f => f.parentId == 0)
      let nodes = this.buildTree(groups);
      this.treeNodes.set(nodes);
    })
  }

  private editUser() {
    let user = this.selectedUser();
    this.ref = this.dialogService.open(UserEdit, {
      header: 'Редактирование пользователя',
      inputValues: { user: this.selectedUser() },
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

  saveData(entity: User): Observable<boolean> {
    if (typeof (entity) === 'undefined') {
      return throwError(() => new Error("Entity is undefined"));
    };
    if (entity.id === 0) {
      return this.service.post(entity).pipe(
        map((data: User) => {
          this.store.updateUser(data);
          return true;
        })
      )
    }
    return this.service.put(entity).pipe(
      map((data: User) => {
        this.store.updateUser(data);
        return true;
      })
    )
  }

  newUser(): void {

    this.ref = this.dialogService.open(UserEdit, {
      header: 'Редактирование пользователя',
      inputValues: { user: { id: 0, fullname: '', login: '', role: 3, canDelete: true, groupId: this.selectedGroup()?.data.id } },
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
  buildTree(groups: Group[]): TreeNode[] {
    let nodes = new Array<TreeNode>;
    groups.forEach(el => {
      let treeNode: TreeNode = {
        key: el.id.toString(),
        label: el.title,
        data: el

      }
      let childrenGroups = this.store.groupsEntities().filter(f => f.parentId == el.id)
      if (childrenGroups.length != 0) {
        let children = this.buildTree(childrenGroups)
        treeNode.children = children;
      }

      nodes.push(treeNode);
    });
    return nodes;
  }

  menuClick($event: any, user: User): void {
    this.selectedUser.set(user);
    this.menu()?.toggle($event)
  }

  search($event: AutoCompleteCompleteEvent) {
    let res = this.store.usersEntities().filter(f => 
      f.fullname.toLowerCase().includes($event.query.toLowerCase()) || f.login.toLowerCase().includes($event.query.toLowerCase())).map(m => m.fullname)
    this.searchedUsers.set(res);
  }

}
