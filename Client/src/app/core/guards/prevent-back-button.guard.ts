import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, GuardResult, RouterStateSnapshot } from '@angular/router';

export interface CanComponentDeactivate {
    canComponentDeactivate(): GuardResult
}

export function PreventBackButton<T>(component: T, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState: RouterStateSnapshot,) {
    var c = component as CanComponentDeactivate;
    if (!!c) {
        return c.canComponentDeactivate()
    }
    else 
        return true;
}