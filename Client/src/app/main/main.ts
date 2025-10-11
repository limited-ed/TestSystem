import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationStore } from 'state/application-store';

@Component({
  selector: 'app-main',
  imports: [],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main {

  store = inject(ApplicationStore);
  router = inject(Router);

  constructor() {
    effect(() => {

    });
  }
}
