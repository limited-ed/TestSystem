import { JsonPipe, Location } from '@angular/common';
import { Component, effect, inject, input, linkedSignal, model, signal } from '@angular/core';
import { deepClone } from 'core';
import { ButtonModule } from 'primeng/button';
import { AdministratorStore } from 'state';

import { EditorModule } from 'primeng/editor';
import { FormsModule } from '@angular/forms';
import { Question } from 'models';

import { TabsModule } from 'primeng/tabs';
import { PanelModule } from 'primeng/panel';
import { FluidModule } from 'primeng/fluid';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';

import { Router } from '@angular/router';
import { DialogService, DynamicDialogComponent, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-question-edit',
  imports: [ButtonModule, EditorModule, TabsModule, FormsModule, PanelModule, FluidModule, TextareaModule, CheckboxModule, ConfirmDialog],
  templateUrl: './question-edit.html',
  styleUrl: './question-edit.css',
  providers: [ConfirmationService, MessageService]
})
export class QuestionEdit {

  question = input.required<Question>();

  store = inject(AdministratorStore);
  router = inject(Router);
  location = inject(Location);
  confirmationService = inject(ConfirmationService);

  ref = inject(DynamicDialogRef);
  dialogService = inject(DialogService);
  dialog: DynamicDialogComponent | undefined;

  editQuestion = linkedSignal(
    () => {
      let q = deepClone(this.question());
      q.answers.forEach((a, index) => a.innerId = index + 1);
      return q
    }

  );

  tab = model<number>(1);

  isSaving = signal(false);

  scrollableTabs: any[] = Array.from({ length: 50 }, (_, i) => ({ title: "Title", content: "Content" }));

  constructor() {
    this.dialog = this.dialogService.getInstance(this.ref);

    effect(() => {
      if (this.tab() === 0) {
        this.editQuestion().answers.push({ id: 0, content: '', isRight: false, questionId: this.question().id, innerId: this.editQuestion().answers.length + 1 });
        this.tab.set(this.editQuestion().answers.length);
      };
    });
  }


  deleteAnswer(index: number) {
    this.confirmationService.confirm({
      message: 'Удалить ответ из вопроса, отменить действие нельзя? ',
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
        let i = this.editQuestion().answers.findIndex(a => a.id === index);
        this.editQuestion().answers.splice(i,1);
        if (i>0) {
          this.tab.set(this.editQuestion().answers[i-1].innerId);
        } else
        {
          this.tab.set(this.editQuestion().answers[0].innerId);
        }
      }
    });
  }

  ok() {
    this.isSaving.set(true);
    this.dialog?.data.saveData(this.editQuestion()).subscribe({
      next: (result: boolean) => {
        this.ref.close();
      },
      error: (error: string) => {
        this.isSaving.set(false);
      },
      complete: () => { }
    });

  }

  cancel() {
    this.ref.close();
  }
}
