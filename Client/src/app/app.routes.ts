import { Routes } from '@angular/router';
import { canActivateAdmin, canActivateUser } from 'core';
import { canActivateMain } from 'core/activators/activators';
import { canActivateTest } from 'core/activators/test-activator';
import { PreventBackButton } from 'core/guards/prevent-back-button.guard';
import { UserDashboard } from 'user/user-dashboard/user-dashboard';

export const routes: Routes = [
    { path: "", redirectTo: 'main', pathMatch: 'full' },
    { path: "main", loadComponent: () => import('main/main').then(c => c.Main), canActivate: [canActivateMain] },
    { path: "login", loadComponent: () => import('login/login').then(c => c.Login) },
    {
        path: "admin", canActivate: [canActivateAdmin], loadComponent: () => import('admin/dashboard/admin-dashboard/admin-dashboard').then(c => c.AdminDashboard), children: [
            { path: 'users', loadComponent: () => import('admin/user/users-list/users-list').then(c => c.UsersList) },
            { path: 'groups', loadComponent: () => import('admin/group-edit/group-edit').then(c => c.GroupEdit) },
            { path: 'categories', loadComponent: () => import('admin/category/categories-list/categories-list').then(c => c.CategoriesList) },
            { path: 'questions', loadComponent: () => import('admin/question/question-list/question-list').then(c => c.QuestionList), pathMatch: 'full' },
            {
                path: 'tests', children: [
                    { path: 'list', loadComponent: () => import('admin/test/tests-list/tests-list').then(c => c.TestsList) },
                    { path: 'view/:id', loadComponent: () => import('admin/test/test-view/test-view').then(c => c.TestView) },
                    { path: 'new', loadComponent: () => import('admin/test/test-view/test-view').then(c => c.TestView) },

                ]
            },
            { path: 'results', loadComponent: () => import('admin/result/results-list/results-list').then(c => c.ResultsList) }

        ]
    },
    { path: "user", loadComponent: () => import('user/user-dashboard/user-dashboard').then(c => c.UserDashboard), canActivate: [canActivateUser]},
    { path: 'test', loadComponent: ()=> import('user/test-component/test-component').then(c=>c.TestComponent), canActivate:[canActivateTest], }

];
