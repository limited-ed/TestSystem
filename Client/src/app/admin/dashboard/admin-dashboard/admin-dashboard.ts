import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DashboardHeaderComponent, DashboardSidebarComponent } from 'admin';
import { MenuItem } from 'models';
import { catchError, forkJoin, tap } from 'rxjs';
import { CategoryService, GroupService, UserService } from 'services';
import { AdministratorStore, ApplicationStore } from 'state';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { QuestionService } from 'services/question-service/question-service';


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
              icon:"pi pi-list",
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
              routerLink: '/admin/tests'
            },            

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
              label: 'Редактор вопросов',
              icon: 'pi-question',
            },
            {
              label: 'Редактор тестов',
              icon: 'pi-file-edit',
            }
          ]
        },
        {
          label: 'Результаты и отчеты',
          header: true,
          opened: true,
          icon: 'pi pi-chart-bar',
          routerLink: '/admin/results',
          items: [
              { label: 'Просмотр результатов', icon:"pi pi-list-check"}
            ]
          
        }
      ]
    }
  }
  );

  ngOnInit(): void {
    let a = 1;
    forkJoin([
      this.userSrv.get(), 
      this.groupSrv.get(),
      this.categoriesSrv.get(),  
      this.questionSrv.get() 
    ]).subscribe({
      next: next => {
        this.store.updateAllUsers(next[0]),
        this.store.updateAllGroups(next[1]),
        this.store.updateAllCategories(next[2]),
        this.store.updateAllQuestions(next[3])
      },
      error: error => { },
      complete: () => { }
    });
  }

  hide() {
    this.showSidepanel.set(!this.showSidepanel());
  }



}
