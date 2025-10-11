import { Component, input, linkedSignal, signal } from '@angular/core';
import { inject } from '@angular/core/primitives/di';
import { Control, form, required } from '@angular/forms/signals';
import { Category } from 'models';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogComponent, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-category-edit',
  imports: [ButtonModule, InputTextModule, SelectModule, Control],
  templateUrl: './category-edit.html',
  styleUrl: './category-edit.css'
})
export class CategoryEdit {

  category = input<Category>()

  model = linkedSignal<Category>(() => Object.assign({}, this.category()));

  isSaving = signal<boolean>(false);

  categoryForm = form(this.model, schema => {
    required(schema.title);
  });


  dialog: DynamicDialogComponent | undefined;


  constructor(private ref: DynamicDialogRef, private dialogService: DialogService) {

    this.dialog = this.dialogService.getInstance(this.ref);
  }

  ok() {
    this.isSaving.set(true);
    this.dialog?.data.saveData(this.categoryForm().value()).subscribe({
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
