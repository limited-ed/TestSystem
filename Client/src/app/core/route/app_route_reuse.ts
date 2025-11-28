import { Provider } from "@angular/core";
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from "@angular/router";

interface StoredRoute {
    route: ActivatedRouteSnapshot;
    handle: DetachedRouteHandle
}

interface IRouteData {
    reuse: boolean
}

export class AppRouteReuseStrategy implements RouteReuseStrategy {
    private storeCache: Record<string, StoredRoute> = {}

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        let ret = !!(route.data as IRouteData).reuse
        return ret;

    }
    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
        let path = this.getFullPath(route);
        if (handle && route.url.findIndex(f => f.path.includes('test')) === -1) this.storeCache[path] = { route, handle }
    }
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        let path = this.getFullPath(route);
        return !!this.storeCache[path]
    }
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        let path = this.getFullPath(route);
        if (!this.storeCache[path]) return null;
        return this.storeCache[path].handle;
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
    }

    private getFullPath(route: ActivatedRouteSnapshot): string {
        return route.pathFromRoot
            .map(m => m.url.map(segment => segment.toString()))
            .join("/").trim()
            .replace(/\/$/, "");
    }

}

export function provideReuseStrategy(): Provider {
    return {
        provide: RouteReuseStrategy,
        useClass: AppRouteReuseStrategy
    }
}