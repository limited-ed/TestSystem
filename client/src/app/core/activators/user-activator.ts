import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, GuardResult, Router, RouterStateSnapshot } from '@angular/router';
import { UserRoles } from 'models';
import { ApplicationStore } from 'state/application-store';


export function canActivateUser(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): GuardResult {
    const router = inject(Router);
    const store = inject(ApplicationStore);
    if (store.isLogged()) {
        if(store.user()?.role.includes(UserRoles.User)) {
            return true;
        }
    }

     return router.createUrlTree(['/login']);
}

