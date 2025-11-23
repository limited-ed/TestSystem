import { Component, computed, effect, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Result } from 'models';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ApplicationStore } from 'state';
import { UserStore } from 'state/user-store';

@Component({
  selector: 'app-result-component',
  imports: [AvatarModule, ButtonModule],
  templateUrl: './result-component.html',
  styleUrl: './result-component.css'
})
export class ResultComponent {

  router = inject(Router);
  appStore = inject(ApplicationStore);
  userStore = inject(UserStore);
  
  constructor() {

  }


  closeAndExit(){
    this.userStore.resetState();
    this.appStore.resetStore();
    this.router.navigate(["/login"]);
  }

}
