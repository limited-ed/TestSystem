import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { UserRoles } from 'models';
import { ApplicationStore } from 'state/application-store';
import { UserStore } from 'state/user-store';


export function canActivateTest(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    const store = inject(UserStore);
    if (store.mode() == 'testing') {
        return true;
    }

    return false;
}