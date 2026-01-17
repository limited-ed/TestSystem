import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UserRoles } from 'models';
import { ApplicationStore } from 'state/application-store';


export const canActivateAdmin: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): GuardResult => {
    const router = inject(Router);
    const store = inject(ApplicationStore);
    if (store.isLogged()) {
        let roles = [UserRoles.Administrator, UserRoles.Editor];
        let role = store.user()?.role;
        if (role && roles.indexOf(role) !== -1) {
            return true;
        }
    }

    return router.createUrlTree(['/login']);
}

