import { Component, inject, input, linkedSignal, signal } from '@angular/core';
import { Field, form, required } from '@angular/forms/signals';
import { deepClone } from 'core';
import { Group } from 'models';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DialogService, DynamicDialog } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-group-edit',
  imports: [InputTextModule, ButtonModule, Field],
  templateUrl: './group-edit.html',
  styleUrl: './group-edit.css',
})
export class GroupEdit {

  group = input.required<Group>();

  ref = inject(DynamicDialogRef);
  dialogService = inject(DialogService);
  dialog: DynamicDialog | undefined;

  editGroup = linkedSignal(() => deepClone(this.group()));

  constructor() {
    this.dialog = this.dialogService.getInstance(this.ref);
  }

  editForm = form(this.editGroup, (schema) => {
    required(schema.title);
  });

  isSaving = signal(false);

  ok() {
    this.isSaving.set(true);
    this.dialog?.data.saveData(this.editForm().value()).subscribe({
      next: (result: boolean) => {
        this.ref.close();
      },

      error: (error: string) => {
        this.isSaving.set(false);
      },

      complete: () => {

      }
    })

  }

  cancel() {
    this.ref.close();
  }

}
