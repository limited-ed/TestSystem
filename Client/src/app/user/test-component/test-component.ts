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
import { ResultItem, TestResult } from 'models';
import { form, Field } from '@angular/forms/signals'
import { EndTestService } from 'services/end-test-service/end-test-service';


interface AnswerCheckBoxModel {
  answerId: number;
  checked: boolean;
}

interface AnswerItems {
  items: AnswerCheckBoxModel[]
}


@Component({
  selector: 'app-test-component',
  imports: [ButtonModule, ProgressBarModule, AvatarModule, NgClass, Field],
  templateUrl: './test-component.html',
  styleUrl: './test-component.css'
})
export class TestComponent implements CanComponentDeactivate {

  router = inject(Router)
  userStore = inject(UserStore);
  appStore = inject(ApplicationStore);
  endtestSrv = inject(EndTestService);

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
  shuffled = computed(() => this.shuffleAnswers(this.currentQuestion().answers.length));

  answers = signal<AnswerItems>({ items: [] })
  answersForm = form(this.answers);

  canComponentDeactivate(): GuardResult {
    return this.userStore.mode() !== 'testing';
  }

  constructor() {
    this.total = this.userStore.startedTest().timer * 60;
    this.currentTimer.set(this.total);
    this.setAnswers();

    if (isPlatformBrowser(this.platformId)) {
      var counter = window.setInterval(() => {
        if (this.currentTimer() > 0) {
          this.currentTimer.update((val) => val - 1);
        } else {
          this.userStore.updateTestResult({ complete: true });
          let answeredIds = this.userStore.testResult().results.map(m => m.questionId);
          this.userStore.questionsEntities().filter(f => !answeredIds.includes(f.id)).forEach((v, _, __) => {
            let res: ResultItem = {
              id: 0,
              questionId: v.id,
              testId: this.userStore.startedTest().id,
              answers: [],
              right: false
            }
            this.userStore.addResultItem(res);
          });
          this.endTest();
        }
      }, 1000);
    }
  }

  confirmAnswer() {
    let res: ResultItem = {
      id: 0,
      testId: this.userStore.startedTest().id,
      questionId: this.currentQuestion().id,
      answers: this.answersForm.items().value().filter(f=>f.checked).map(m => m.answerId),
      right: false
    }
    this.userStore.addResultItem(res);
    this.userStore.updateTestResult({ answered: this.userStore.testResult().answered + 1 })
    if (this.userStore.testResult().results.length === this.userStore.questionsEntities().length) {
      this.endTest();
      return;
    }
    this.nextQuestion();
  }


  skipAnswer() {
    this.nextQuestion();
  }

  setAnswers() {
    this.answers.set(
      {
        items: this.currentQuestion().answers.map(
          m => ({ answerId: m.id, checked: false })
        )
      }
    );
  }

  private endTest() {
    this.userStore.updateTestResult({ complete: true });
    this.endtestSrv.put(this.userStore.testResult()).subscribe({
      next: (res) => {
        this.userStore.setTestResult(res);
        this.userStore.updateMode('result');
      },
      error: (err) => {

      },
      complete: () => {
        this.router.navigate(['result'], { replaceUrl: true });
      }
    });
  }

  private nextQuestion() {
    let next;
    if (this.currentNumQuestion() !== this.userStore.testResult().total) {
      next = this.userStore.questionsEntities().findIndex(
        (value, index, _) => index > this.currentNumQuestion() && !this.userStore.testResult().results.map(m => m.questionId).includes(value.id)
      );
    } else {
      next = this.userStore.questionsEntities().findIndex((value, _, __) => !this.userStore.testResult().results.map(m => m.questionId).includes(value.id));
    }
    this.currentNumQuestion.set(next);
    this.setAnswers();

  }

  shuffleAnswers(length: number){
    let a = Array.from({ length: length }, (_, i) => i );
    return this.shuffleArray(a);
  }

  private shuffleArray<T>(array: Array<T>): Array<T> {
    for (let i = array.length - 1; i > 0; i--) {
      // Generate a random index from 0 to i
      const j = Math.floor(Math.random() * (i + 1));

      // Swap elements at index i and j
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

}
