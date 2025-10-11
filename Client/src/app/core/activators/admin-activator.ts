import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { UserRoles } from 'models';
import { ApplicationStore } from 'state/application-store';


export function canActivateAdmin(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    const store = inject(ApplicationStore);
    if (store.isLogged()) {
        let roles=[UserRoles.Administrator, UserRoles.Editor];
        let role=store.user()?.role;
        if(role && roles.indexOf(role)!==-1) {
            return true;
        }
    }

    return false;
}

