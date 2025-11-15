import { Component, computed, effect, inject, input, linkedSignal, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { deepClone } from 'core';
import { Group, GroupTest, Test, TestPart } from 'models';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { AdministratorStore } from 'state';
import { TestAddCategory } from '../test-add-category/test-add-category';
import { of } from 'rxjs';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageBus } from 'core/message-bus/message-bus';
import { TreeModule } from 'primeng/tree';
import { TestService } from 'services/test-service/test-service';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'app-test-view',
  imports: [TabsModule, ButtonModule, InputTextModule, TableModule, InputNumber, FormsModule, TableModule, TreeModule, ConfirmDialog],
  templateUrl: './test-view.html',
  styleUrl: './test-view.css',
  providers: [DialogService, ConfirmationService]
})
export class TestView {

  id = input<number>();


  msgSrv = inject(MessageBus);
  router = inject(Router);
  store = inject(AdministratorStore);
  dialogService = inject(DialogService);
  ref: DynamicDialogRef | null = null;
  testService = inject(TestService);
  confirmationService = inject(ConfirmationService);

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

  selectedGroups = model<TreeNode[]>([]);

  treeNodes = signal<TreeNode[]>([]);
  isDirty = signal<boolean>(false);

  constructor() {
    effect(() => {
      var nodes = this.buildTree(this.store.groupsEntities().filter(f => f.parentId === 0));
      this.treeNodes.set(nodes.nodes);
      this.selectedGroups.set(nodes.selected);

    })
  }

  markDirty() {
    this.isDirty.set(true);
  }

  save() {
    if (!!this.selectedGroups()) {
      this.editTest().groupTests = this.selectedGroups()?.map(m => {
        return { groupId: m.data.id, testId: this.editTest().id } as GroupTest
      })
    } else {
      this.editTest().groupTests = [];
    }

    if (this.editTest().id == 0) {
      this.testService.post(this.editTest()).subscribe({
        next: (res) => {
          this.store.updateTest(res);
          this.router.navigateByUrl('/admin/tests/list', { replaceUrl: true })
        }
      });
    } else {
      this.testService.put(this.editTest()).subscribe({
        next: (res) => {
          this.store.updateTest(res);
          this.router.navigateByUrl('/admin/tests/list', { replaceUrl: true })
        }
      });
    }
  }

  cancel() {
    if (this.isDirty()) {
      this.confirmationService.confirm({
        message: 'У вас имеются несохраненные данные,<br/> вы действительно хотите удалить их вернуться назад?',
        header: 'Несохраненные данные',
        closable: true,
        closeOnEscape: true,
        icon: 'pi pi-exclamation-triangle',
        rejectButtonProps: {
          label: 'Отмена',
          severity: 'secondary',

        },
        acceptButtonProps: {
          label: 'Удалить и вернуться',
          severity: 'danger',
          outlined: true,
        },
        accept: () => {
          this.confirmationService.close();
          setTimeout(() => {
            this.router.navigateByUrl('/admin/tests/list', { replaceUrl: true });
          }, 10);

        }
      });
    } else {
      this.router.navigateByUrl('/admin/tests/list', { replaceUrl: true })
    }
  }

  getCategoryTitle(categoryId: number) {
    const category = this.store.categoriesEntities().find(f => f.id == categoryId);
    return category ? category.title : 'Неизвестная категория';
  }

  addCategory() {
    if (this.categories().length === 0) {
      this.msgSrv.send({ severity: 'warn', summary: 'Все категории добавлены', detail: 'Все возможные категории добавлены в тест', sticky: true });
      return;
    }
    this.ref = this.dialogService.open(TestAddCategory, {
      header: 'Добавить категорию в тест',
      inputValues: { categories: this.categories(), editPart: { testId: this.editTest().id, id: 0, count: 0, categoryId: 0 } as TestPart },
      data: {
        save: (part: TestPart) => {
          this.editTest().parts.push(part);
          this.store.updateTest(this.editTest());
          this.markDirty()
          return of(true);
        }
      },
      width: '30vw',
      modal: true,
      closable: true,
      breakpoints: {
        '1500px': '50vw',
        '1200px': '60vw',
        '900px': '70vw'
      },
    });
  }

  deletePart(part: TestPart) {
    this.confirmationService.confirm({
      message: 'Удалить категорию вопросов из теста?',
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
        this.editTest().parts = this.editTest().parts.filter(f => f != part);
        this.markDirty()
      }
    });

  }


  buildTree(groups: Group[]): { nodes: TreeNode[], selected: TreeNode[] } {
    let nodes = new Array<TreeNode>;
    let selectedGroups = new Array<TreeNode>;
    groups.forEach(el => {
      let treeNode: TreeNode = {
        key: el.id.toString(),
        label: el.title,
        data: el,
      }
      var selected = false;
      if (this.editTest().groupTests?.some(s => s.groupId === el.id)) {
        selectedGroups.push(treeNode);
        selected = true;
      }

      let childrenGroups = this.store.groupsEntities().filter(f => f.parentId == el.id)
      if (childrenGroups.length != 0) {
        let children = this.buildTree(childrenGroups)
        treeNode.children = children.nodes;
        selectedGroups.push(...children.selected);
        if (children.selected.length > 0 && !selected) {
          treeNode.partialSelected = true;
        }
      }

      nodes.push(treeNode);
    });


    return { nodes: nodes, selected: selectedGroups };
  }



}
