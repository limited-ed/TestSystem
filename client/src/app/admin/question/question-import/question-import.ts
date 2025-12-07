import { Component, effect, ElementRef, inject, model, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Question } from 'models';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DialogService, DynamicDialog } from 'primeng/dynamicdialog';
import { Table, TableModule } from 'primeng/table';
import { RemoveTagsPipe } from "core/pipes/remove-tags";



@Component({
  selector: 'app-question-import',
  imports: [ButtonModule, FormsModule, TableModule, RemoveTagsPipe],
  templateUrl: './question-import.html',
  styleUrl: './question-import.css',
})
export class QuestionImport {

  isSaving = signal(false);

  ref = inject(DynamicDialogRef);
  dialogService = inject(DialogService);
  dialog: DynamicDialog | undefined;

  questions = signal<Question[]>([]);

  constructor() {
    this.dialog = this.dialogService.getInstance(this.ref);
  }

  change($event: any) {
    let file = new FileReader()
    file.onload = () => {
      if (file.result !== null) {
        this.questions.set(JSON.parse(file.result as string));
      }
    }
    file.readAsText($event.target.files[0]);
  }

  ok() {
    this.dialog?.data.saveData(this.questions()).subscribe({
      next: () => {
        this.ref.close();
      }
    });
  }

  cancel() {
    this.ref.close();
  }

}
