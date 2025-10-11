import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ApplicationStore } from 'state/application-store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Client');
  router = inject (Router);

  constructor(private store: ApplicationStore) {
    effect(()=>{
    })
  }

}
