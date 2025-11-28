import { Component, computed, inject, signal } from '@angular/core';
import { Group } from 'models';
import { ConfirmationService, TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TreeModule, TreeNodeCollapseEvent, TreeNodeExpandEvent } from 'primeng/tree';
import { map, Observable, of } from 'rxjs';
import { AdministratorStore } from 'state';
import { GroupEdit } from '../group-edit/group-edit';
import { deepClone, MessageBus } from 'core';
import { Field } from '@angular/forms/signals';
import { GroupService } from 'services';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-group-view',
  imports: [ButtonModule, TreeModule, ConfirmDialog],
  providers: [DialogService, ConfirmationService],
  templateUrl: './group-view.html',
  styleUrl: './group-view.css'
})
export class GroupView {

  store = inject(AdministratorStore);
  srv = inject(GroupService);
  msgSrv = inject(MessageBus);

  dialogService = inject(DialogService);
  ref: DynamicDialogRef | null = null;
  confirmationService = inject(ConfirmationService);

  selectedGroup = signal<TreeNode | undefined>(undefined);

  editGroup(group: Group | undefined) {
    if (!group) {
      group = {
        id: 0,
        title: '',
        parentId: this.selectedGroup()?.data.id,
        canDelete: true,
        expanded: false
      }
    }
    this.ref = this.dialogService.open(GroupEdit, {
      header: 'Редактирование группы',
      inputValues: { group: group },
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

  deleteGroup() {
    if (this.store.groupsEntities().some(s => s.parentId == this.selectedGroup()?.data.id) ||
      this.store.usersEntities().some(s => s.groupId === this.selectedGroup()?.data.id)) {
      this.msgSrv.send({
        severity: 'error', summary: 'Удаление невозможно',
        detail: 'Невозможно удалить группу в которой есть подгруппы или пользователи', sticky: true
      });
      return;
    }
    if (!this.selectedGroup()?.data.canDelete) {
      this.msgSrv.send({
        severity: 'error', summary: 'Удаление невозможно',
        detail: 'Эту группу нельзя удалить', sticky: true
      });
      return;
    }
    this.confirmationService.confirm({
      message: `Удалить группу "${this.selectedGroup()?.data.title}"`,
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
        this.srv.delete(this.selectedGroup()?.data).subscribe({
          next: () => {
            this.store.deleteGroup(this.selectedGroup()?.data.id)
          },
          error: () => {
            this.msgSrv.send({
              severity: 'error', summary: 'Удаление невозможно',
              detail: 'Ошибка сервера, обратитесь к администратору', sticky: true
            });
          }
        });
      }
    });
  }

  saveData(group: Group): Observable<boolean> {
    if (group.id === 0) {
      return this.srv.post(group).pipe(
        map((group) => {
          let parent = this.store.groupsEntities().find(f=>f.id==group.parentId);
          this.store.updateGroup(group);
          this.store.updateGroup({...parent!, expanded: true})
          return true;
        })
      )
    } else {
      return this.srv.put(group).pipe(
        map((group) => {
          this.store.updateGroup(group);
          return true;
        })
      )
    }
  }

  nodes = computed(() => {
    let root = this.store.groupsEntities().filter(f => this.store.groupsEntities().findIndex(i => i.id === f.parentId) === -1)
    return this.buildTree(root);
  })

  nodeExpand(event: TreeNodeExpandEvent) {
    this.store.updateGroup({ ...event.node.data, expanded: true })

  }

  nodeCollapse(event: TreeNodeCollapseEvent) {
    this.store.updateGroup({ ...event.node.data, expanded: false })
  }

  buildTree(groups: Group[]): TreeNode[] {
    let nodes = new Array<TreeNode>;
    groups.forEach(el => {
      let treeNode: TreeNode = {
        key: el.id.toString(),
        label: el.title,
        data: el,
        expanded: el.expanded
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

}
