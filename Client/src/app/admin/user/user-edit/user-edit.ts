import { Component, computed, effect, inject, input, linkedSignal, signal } from '@angular/core';
import { form, required, validate, customError, Control } from '@angular/forms/signals';
import { RoleSelector } from 'admin/selector/selector';
import { User } from 'models';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogComponent, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-user-edit',
  imports: [ButtonModule, InputTextModule, SelectModule, Control, RoleSelector],
  templateUrl: './user-edit.html',
  styleUrl: './user-edit.css'
})
export class UserEdit {
  roles = [
    { name: 'Администратор', code: 1 },
    { name: 'Редактор', code: 2 },
    { name: 'Пользователь', code: 3 }
  ];

  user = input<User>();

  editUser = linkedSignal<User>(() => Object.assign({ password: '', confirmation: '' }, this.user()));

  isSaving = signal<boolean>(false);

  userForm = form(this.editUser, (schema) => {
    required(schema.fullname);
    required(schema.login);
    required(schema.role);
    validate(schema, (v) => {
      if (v.value().password !== v.value().confirmation) {
        return customError({
          message: 'Пароль и подтверждение должны совпадать'
        })
      }
      return null;
    })
  });

  ref = inject(DynamicDialogRef);
  dialogService = inject(DialogService);
  dialog: DynamicDialogComponent | undefined;

  constructor() {
    this.dialog = this.dialogService.getInstance(this.ref);
  }

  ok() {
    this.isSaving.set(true);
    this.dialog?.data.saveData(this.userForm().value()).subscribe({
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
