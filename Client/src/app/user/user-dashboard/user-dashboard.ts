import { Component, effect, inject, linkedSignal, model, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeSwitcher } from 'admin/dashboard';

import { MenuItem } from 'primeng/api';

import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { PanelModule } from 'primeng/panel';
import { SelectModule } from 'primeng/select';
import { SplitButtonModule } from 'primeng/splitbutton';
import { StartTestService } from 'services/start-test-service/start-test';
import { TestService } from 'services/test-service/test-service';
import { ApplicationStore } from 'state';
import { UserStore } from 'state/user-store';

@Component({
  selector: 'app-user-dashboard',
  imports: [PanelModule, SelectModule, FormsModule, FormsModule, FluidModule, ButtonModule, ThemeSwitcher, SplitButtonModule, AvatarModule],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css'
})
export class UserDashboard implements OnInit {

  testSrv = inject(TestService)
  startTestSrv = inject(StartTestService);

  appStore = inject(ApplicationStore);
  userStore = inject(UserStore);
  router = inject(Router);


  selectedTest = model(0);

  avatarItems: MenuItem[] = [
    {
      label: 'Просмотр результатов'
    },
    {
      separator: true
    },
    {
      label: 'Выход',
      command: () => {
        this.appStore.updateUser(undefined);
        this.appStore.updateIsLogin(false);
        this.router.navigate(['/login']);
      }
    }
  ];

  userName = linkedSignal(() => this.appStore.user()?.fullname);

  constructor() {

  }
  ngOnInit(): void {
    let userid = this.appStore.user()?.id;
    if (!!userid) {
      this.testSrv.getForUser(userid).subscribe({
        next: (res) => {
          this.userStore.updateTest(res);
        }
      });
    }
  }

  startTest() {
    if (this.selectedTest()) {
      this.startTestSrv.startTest(this.selectedTest()).subscribe({
        next: (res)=>{
          this.userStore.updateQuestions(res.questions);
          this.userStore.updateState({
            mode: 'testing',
            startedTest: res.test,
            testToken: res.token
          });
          this.router.navigate(['/test'])
        }
      })
    }

  }

}
