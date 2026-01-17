import { Component, input,  } from '@angular/core';
import { NgTemplateOutlet,  } from "@angular/common";
import { MenuItem } from 'models';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'dashboard-menu',
  imports: [ NgTemplateOutlet, RouterLink, RouterLinkActive ],
  templateUrl: './dashboard-menu.component.html',
  styleUrl: './dashboard-menu.component.css'
})
export class DashboardMenuComponent {
  items=input.required<MenuItem[]>();
}
