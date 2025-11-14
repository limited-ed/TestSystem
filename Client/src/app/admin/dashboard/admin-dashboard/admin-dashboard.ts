import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DashboardHeaderComponent, DashboardSidebarComponent } from 'admin/dashboard';
import { MenuItem } from 'models';
import { catchError, forkJoin, tap } from 'rxjs';
import { CategoryService, GroupService, UserService } from 'services';
import { AdministratorStore, ApplicationStore } from 'state';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { QuestionService } from 'services/question-service/question-service';
import { TestService } from 'services/test-service/test-service';
import { MessageBus } from 'core/message-bus/message-bus';


@Component({
  selector: 'app-admin-dashboard',
  imports: [DashboardHeaderComponent, DashboardSidebarComponent, RouterModule, Toast],
  providers: [MessageService],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {

  router = inject(Router);

  store = inject(AdministratorStore);
  appStrore = inject(ApplicationStore);
  userSrv = inject(UserService);
  groupSrv = inject(GroupService);
  categoriesSrv = inject(CategoryService);
  questionSrv = inject(QuestionService);
  testSrv = inject(TestService);

  msgSrv = inject(MessageService);
  msgBus = inject(MessageBus);

  showSidepanel = signal(true);

  items = computed<MenuItem[]>(() => {
    if (this.appStrore.user()?.role === 'Administrator') {
      return [
        {
          label: 'Пользователи и группы',
          header: true,
          opened: true,
          icon: 'pi-users',
          items: [
            {
              label: 'Пользователи',
              icon: 'pi-user',
              routerLink: '/admin/users'
            },
            {
              label: 'Группы',
              routerLink: '/admin/groups',
              icon: 'pi-users',
            }
          ]
        },
        {
          label: 'Тесты',
          header: true,
          opened: true,
          icon: 'pi-file',
          items: [
            {
              label: "Категории вопросов",
              icon: "pi pi-list",
              routerLink: "/admin/categories"
            },
            {
              label: 'Редактор вопросов',
              icon: 'pi-question',
              routerLink: '/admin/questions'
            },
            {
              label: 'Редактор тестов',
              icon: 'pi-file-edit',
              routerLink: '/admin/tests/list'
            },
          ]
        },
        {
          label: 'Результаты и отчеты',
          header: true,
          opened: true,
          icon: 'pi pi-chart-bar',
          routerLink: '/admin/results',
          items: [
            { label: 'Просмотр результатов', icon: "pi pi-list-check", routerLink: '/admin/results' }
          ]
        }
      ]
    }
    else {
      return [
        {
          label: 'Пользователи и группы',
          header: true,
          opened: true,
          icon: 'pi-users',
          items: [
            {
              label: 'Пользователи',
              icon: 'pi-user',
              routerLink: '/admin/users'
            }
          ]
        },
        {
          label: 'Тесты',
          header: true,
          opened: true,
          icon: 'pi-file',
          items: [
            {
              label: "Категории вопросов",
              icon: "pi pi-list",
              routerLink: "/admin/categories"
            },
            {
              label: 'Редактор вопросов',
              icon: 'pi-question',
              routerLink: '/admin/questions'
            },
            {
              label: 'Редактор тестов',
              icon: 'pi-file-edit',
              routerLink: '/admin/tests/list'
            },
          ]
        },
        {
          label: 'Результаты и отчеты',
          header: true,
          opened: true,
          icon: 'pi pi-chart-bar',
          routerLink: '/admin/results',
          items: [
            { label: 'Просмотр результатов', icon: "pi pi-list-check" }
          ]

        }
      ]
    }
  }
  );

  constructor(){
    this.msgBus.on().subscribe({
      next: (message) => {
        this.msgSrv.add(message);
      }
    });
  }

  ngOnInit(): void {
    let a = 1;
    forkJoin({
      users: this.userSrv.get(),
      groups: this.groupSrv.get(),
      categories: this.categoriesSrv.get(),
      questions: this.questionSrv.get(),
      tests: this.testSrv.get()
    }).subscribe({
      next: next => {
        this.store.updateAllUsers(next.users),
          this.store.updateAllGroups(next.groups),
          this.store.updateAllCategories(next.categories),
          this.store.updateAllQuestions(next.questions),
          this.store.updateAllTests(next.tests)
      },
      error: error => {
        this.msgSrv.add({ severity: 'error', summary: 'Ошибка', detail: 'Ошибка при загрузке данных', sticky: true });
      },
      complete: () => { }
    });
  }

  hide() {
    this.showSidepanel.set(!this.showSidepanel());
  }



}
