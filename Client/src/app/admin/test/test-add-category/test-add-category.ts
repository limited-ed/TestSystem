import { Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { error } from 'console';
import { Category, TestPart } from 'models';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DialogService, DynamicDialog } from 'primeng/dynamicdialog';
import { FluidModule } from 'primeng/fluid';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { AdministratorStore, ApplicationStore } from 'state';


interface MaxValues{
  id: number,
  count: number
}

@Component({
  selector: 'app-test-add-category',
  imports: [SelectModule, InputNumberModule, FormsModule, ButtonModule, FluidModule],
  templateUrl: './test-add-category.html',
  styleUrl: './test-add-category.css'
})
export class TestAddCategory {

  editPart = input.required<TestPart>()
  categories = input<Category[]>();

  store = inject(AdministratorStore)

 // max= computed(() => this.store.categoriesEntities().map((m) => <MaxValues>{id: m.id, count: this.store.questionsEntities().filter(f=>f.categoryId === m.id).length}))

  ref = inject(DynamicDialogRef);
  dialogService = inject(DialogService);
  dialog: DynamicDialog | undefined;

  constructor() {
    this.dialog = this.dialogService.getInstance(this.ref);
  }

  ok() {
    this.dialog?.data.save(this.editPart()).subscribe({
      next: this.ref.close(),
      error: ()=>{}
    })
  }

  cancel() {
    this.ref.close();
  }


}
