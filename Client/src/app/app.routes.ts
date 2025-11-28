import { Routes } from '@angular/router';
import { canActivateAdmin, canActivateUser } from 'core';
import { canActivateMain } from 'core/activators/activators';
import { canActivateTest } from 'core/activators/test-activator';
import { PreventBackButton } from 'core/guards/prevent-back-button.guard';
import { UserDashboard } from 'user/user-dashboard/user-dashboard';

export const routes: Routes = [
    { path: "", redirectTo: 'main', pathMatch: 'full' },
    { path: "main", loadComponent: () => import('main/main').then(c => c.Main), canActivate: [canActivateMain], data: { reuse: true } },
    { path: "login", loadComponent: () => import('login/login').then(c => c.Login), data: { reuse: true } },
    {
        path: "admin", canActivate: [canActivateAdmin], loadComponent: () => import('admin/dashboard/admin-dashboard/admin-dashboard').then(c => c.AdminDashboard), data: { reuse: true }, children: [
            { path: 'users', loadComponent: () => import('admin/user/users-list/users-list').then(c => c.UsersList), data: { reuse: true } },
            { path: 'groups', loadComponent: () => import('admin/groups/group-view/group-view').then(c => c.GroupView), data: { reuse: true } },
            { path: 'categories', loadComponent: () => import('admin/category/categories-list/categories-list').then(c => c.CategoriesList), data: { reuse: true } },
            { path: 'questions', loadComponent: () => import('admin/question/question-list/question-list').then(c => c.QuestionList), pathMatch: 'full' },
            {
                path: 'tests', children: [
                    { path: 'list', loadComponent: () => import('admin/test/tests-list/tests-list').then(c => c.TestsList), data: { reuse: true } },
                    { path: 'view/:id', loadComponent: () => import('admin/test/test-view/test-view').then(c => c.TestView), data: { reuse: true } },
                    { path: 'new', loadComponent: () => import('admin/test/test-view/test-view').then(c => c.TestView) },

                ]
            },
            { path: 'results', loadComponent: () => import('admin/result/results-list/results-list').then(c => c.ResultsList), data: { reuse: true } },
            { path: 'user-results/:id', loadComponent: () => import('admin/user/user-result/user-result').then(c => c.UserResult), },
            { path: 'result-detail/:id', loadComponent: () => import('admin/user/result-details/result-details').then(c => c.ResultDetails) }

        ]
    },
    { path: "user", loadComponent: () => import('user/user-dashboard/user-dashboard').then(c => c.UserDashboard), canActivate: [canActivateUser], data: { reuse: true } },
    { path: 'test', loadComponent: () => import('user/test-component/test-component').then(c => c.TestComponent), canActivate: [canActivateTest], },
    { path: 'result', loadComponent: () => import('user/result-component/result-component').then(c => c.ResultComponent) }

];
