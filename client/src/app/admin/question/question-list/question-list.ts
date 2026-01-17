import { Component, computed, inject, linkedSignal, model, signal, viewChild, ViewEncapsulation } from '@angular/core';
import { form } from '@angular/forms/signals';
import { Answer, Question } from 'models';
import { AdministratorStore } from 'state';
import { SelectModule } from 'primeng/select';
import { FluidModule } from 'primeng/fluid';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Menu, MenuModule } from 'primeng/menu';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { QuestionEdit } from '../question-edit/question-edit';
import { QuestionService } from 'services/question-service/question-service';
import { map, Observable, of, tap, throwError } from 'rxjs';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { RemoveTagsPipe } from 'core';
import { QuestionImport } from '../question-import/question-import';


@Component({
  selector: 'app-question-list',
  imports: [SelectModule, FluidModule, ButtonModule, TableModule, FormsModule, MenuModule, ConfirmDialog, RemoveTagsPipe],
  providers: [DialogService, ConfirmationService],
  templateUrl: './question-list.html',
  styleUrl: './question-list.css',
})
export class QuestionList {

  store = inject(AdministratorStore);
  router = inject(Router);
  service = inject(QuestionService);
  dialogService = inject(DialogService);
  confirmationService = inject(ConfirmationService);

  ref: DynamicDialogRef | null = null;


  selectedCategory = model<number>();

  menuItems: MenuItem[] = [
    {
      label: "Редактировать вопрос", icon: "pi pi-pencil",
      iconStyle: { "color": "var(--color-primary-600)" },
      command: () => {
        this.editQuestion();
      }
    },
    {
      label: "Удалить вопрос", icon: "pi pi-trash",
      iconStyle: { "color": "var(--color-red-600)" },
      command: () => {
        this.deleteQuestion(this.selectedQuestion()!);
      }
    }
  ];

  menu = viewChild<Menu>("questmenu");

  questions = linkedSignal(() => {
    let a = this.selectedCategory();
    return this.store.questionsEntities().filter(f => f.categoryId === this.selectedCategory())
  });

  selectedQuestion = model<Question>();

  menuClick($event: any, question: Question) {
    this.selectedQuestion.set(question);
    this.menu()?.toggle($event)
  }

  editQuestion() {
    this.ref = this.dialogService.open(QuestionEdit, {
      header: 'Редактирование вопроса',
      inputValues: { question: this.selectedQuestion() },
      data: {
        saveData: this.saveData.bind(this)
      },
      width: '75vw',

      modal: true,
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
    });
  }

  newQuestion() {
    this.ref = this.dialogService.open(QuestionEdit, {
      header: 'Редактирование вопроса',
      inputValues: { question: { id: 0, categoryId: this.selectedCategory(), content: '', answers: [{ content: '', questionId: 0, id: 0 } as Answer] } as Question },
      data: {
        saveData: this.saveData.bind(this)
      },
      width: '75vw',
      modal: true,
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
    });
  }

  deleteQuestion(question: Question) {
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
        this.service.delete(question.id).subscribe({
          next: () => {
            this.store.deleteQuestion(question.id);
          }
        });
      }
    });


  }

  saveData(entity: Question): Observable<boolean> {
    if (typeof (entity) === 'undefined') {
      return throwError(() => new Error("Entity is undefined"));
    };

    if (entity.id === 0) {
      return this.service.post(entity).pipe(
        map((data: Question) => {
          this.store.updateQuestion(data);
          return true;
        })
      )
    }
    else {
      return this.service.put(entity).pipe(
        map((data: Question) => {
          this.store.updateQuestion(data);
          return true;
        })
      )
    }
  }

  importFromFile(){
        this.ref = this.dialogService.open(QuestionImport, {
      header: 'Загрузка из файла',
      data: {
        saveData: (questions: Question[])=> {
          return this.service.postMany(questions, this.selectedCategory()!).pipe(
            tap({ next: (result)=>this.store.updateAllQuestions([...this.store.questionsEntities(), ...result])}),
            map( m=> true));
        }
      },
      width: '75vw',
      modal: true,
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
    });
  }
}

