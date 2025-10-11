import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { ApplicationStore } from 'state/application-store';


export function canActivateMain(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let router = inject(Router);
    const store = inject(ApplicationStore);
    if (store.isLogged()) {
        return true;
    }
    else {
        router.navigate(['/login']);
        return false;
    }

}

