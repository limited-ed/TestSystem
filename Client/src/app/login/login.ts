import { JsonPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';

import { form, required, Control } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { jwtDecode } from 'core/jwt';
import { UserRoles } from 'models';
import { AuthModel } from 'models/auth/authModel';
import { User } from 'models/user';
import { UserInfo } from 'models/user-info';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { LoginService } from 'services/login-service/login-service';
import { ApplicationStore } from 'state/application-store';

@Component({
  selector: 'app-login',
  imports: [ButtonModule, CheckboxModule, InputTextModule, Control],
  templateUrl: './login.html',
  styleUrl: './login.css'

})
export class Login {

  error = signal('');

  loginModel = signal<AuthModel>({
    username: '',
    password: ''

  });

  loginForm = form(this.loginModel, (schema) => {
    required(schema.username);
    required(schema.password);
  })

  loginService = inject(LoginService);
  applicationStore = inject(ApplicationStore);
  router = inject(Router);

  login() {
    this.loginService.login(this.loginForm().value()).subscribe({
      next: (result: any) => {
        let decoded = jwtDecode(result.token)
        this.applicationStore.updateIsLogin(true);
        this.applicationStore.updateToken(result.token);
        let user: UserInfo = {
          login: decoded["unique_name"],
          fullname: decoded["fullName"],
          role: decoded["role"],
          id: decoded["userId"],
          canDelete: decoded["canDelete"],
          group: decoded["group"]
        }
        this.applicationStore.updateUser(user);
        if (user.role === UserRoles.Administrator || user.role === UserRoles.Editor) {
          this.router.navigate(['/admin']);
        }
        if (user.role === UserRoles.User) {
          this.router.navigate(['/user']);
        }

      },
      error: (error) => {
        if (error.status = 401) {
          this.error.set('password');
        } else {
          this.error.set('server');
        }
      }

    })

  }

}
