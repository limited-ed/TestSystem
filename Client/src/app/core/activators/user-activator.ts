import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { UserRoles } from 'models';
import { ApplicationStore } from 'state/application-store';


export function canActivateUser(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    const store = inject(ApplicationStore);
    if (store.isLogged()) {
        if(store.user()?.role.includes(UserRoles.User)) {
            return true;
        }
    }

    return false;
}

