import { Component, input, model, } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'role-selector',
  imports: [SelectModule, FormsModule],
  templateUrl: './selector.html',
  styleUrl: './selector.css'
})
export class RoleSelector {

  items=input<any>();

  value=model();


}
