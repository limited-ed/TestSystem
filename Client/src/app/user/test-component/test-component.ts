import { isPlatformBrowser } from '@angular/common';
import { Component, computed, effect, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { GuardResult, RedirectCommand, Router } from '@angular/router';
import { CanComponentDeactivate } from 'core/guards/prevent-back-button.guard';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { Observable } from 'rxjs';
import { UserStore } from 'state/user-store';

@Component({
  selector: 'app-test-component',
  imports: [ButtonModule, ProgressBarModule],
  templateUrl: './test-component.html',
  styleUrl: './test-component.css'
})
export class TestComponent implements CanComponentDeactivate, OnInit {

  router = inject(Router)
  userStore = inject(UserStore);

  platformId = inject(PLATFORM_ID);

  total = 0;
  timer = computed(() => this.currentTimer() / this.total * 100);
  currentTimer = signal(0);

  procents = computed(() => { });
  canComponentDeactivate(): GuardResult {
    return this.userStore.mode() !== 'testing';
  }

  constructor() {
    effect(() => {
      this.total = this.userStore.startedTest().timer * 60000;
      this.currentTimer.set(this.total);

      if (isPlatformBrowser(this.platformId)) {
        window.setInterval(() => {
          this.currentTimer.update((val) => val - 1000);
        }, 1000);
      }
    });
  }

  ngOnInit(): void {

  }

}
