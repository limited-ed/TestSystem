import { isPlatformBrowser, NgClass } from '@angular/common';
import { Component, computed, effect, inject, linkedSignal, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { GuardResult, RedirectCommand, Router } from '@angular/router';
import { CanComponentDeactivate } from 'core/guards/prevent-back-button.guard';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { ApplicationStore } from 'state';
import { UserStore } from 'state/user-store';
import { StyleClass } from "primeng/styleclass";
import { AvatarModule } from 'primeng/avatar';
import { ResultItem } from 'models';

@Component({
  selector: 'app-test-component',
  imports: [ButtonModule, ProgressBarModule, AvatarModule, NgClass],
  templateUrl: './test-component.html',
  styleUrl: './test-component.css'
})
export class TestComponent implements CanComponentDeactivate {

  router = inject(Router)
  userStore = inject(UserStore);
  appStore = inject(ApplicationStore);

  platformId = inject(PLATFORM_ID);

  total = 0;
  timer = computed(() => this.currentTimer() / this.total * 100);
  currentTimer = signal(0);

  timeInMinutes = computed(() => {
    let ct = this.currentTimer();
    const date = new Date(0);
    date.setSeconds(ct);
    let time = date.toISOString().slice(11, 19);
    return time;
  })

  currentNumQuestion = signal(0);
  currentQuestion = linkedSignal(() => this.userStore.questionsEntities()[this.currentNumQuestion()]);
  questionsCount = computed(() => this.userStore.startedTest().parts.reduce((acc, val) => acc + val.count, 0));
  shuffled = computed(() => this.shuffleArray(this.currentQuestion().answers));


  procents = computed(() => { });
  canComponentDeactivate(): GuardResult {
    return this.userStore.mode() !== 'testing';
  }

  constructor() {
    effect(() => {
      this.total = this.userStore.startedTest().timer * 60;
      this.currentTimer.set(this.total);

      if (isPlatformBrowser(this.platformId)) {
        var counter = window.setInterval(() => {
          if (this.currentTimer() > 0) {
            this.currentTimer.update((val) => val - 1);
          } else {
           // this.router.navigate[]
          }

        }, 1000);
      }
    });
  }

  confirmAnswer() {
    let res: ResultItem = {
      id: 0,
      questionId: this.currentQuestion().id,
      answers: [],
      right: false
    }
    this.userStore.addResultItem(res);
    let next = this.userStore.questionsEntities().findIndex((value, index, _) => index > this.currentNumQuestion() && !this.userStore.resultItemsEntities().map(m => m.id).includes(value.id));
    if (next !== -1) {
      this.currentNumQuestion.set(next);
    } else {
      if (this.userStore.resultItemsEntities().length === this.userStore.questionsEntities().length) {
        this.currentNumQuestion.set(0);
        return;
      }

    }
  }

  skipAnswer() {
    if (this.currentNumQuestion() !== this.userStore.questionsEntities().length - 1) {
      this.currentNumQuestion.update(v => v + 1);
    } else {
      this.currentNumQuestion.set(0);
    }
  }

  shuffleArray<T>(array: Array<T>): Array<T> {
    for (let i = array.length - 1; i > 0; i--) {
      // Generate a random index from 0 to i
      const j = Math.floor(Math.random() * (i + 1));

      // Swap elements at index i and j
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

}
