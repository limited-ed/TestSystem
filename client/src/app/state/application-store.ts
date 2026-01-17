import { effect, inject, Injectable, PLATFORM_ID, REQUEST } from "@angular/core";
import { withAppShell } from "@angular/ssr";
import { getState, patchState, signalState, signalStore, withHooks, withMethods, withState } from "@ngrx/signals";
import { withStorage } from "@larscom/ngrx-signals-storage";
import { User } from "models/user";
import { UserInfo } from "models/user-info";
import { ThemeState } from "models/themeState";

import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { jwtDecode } from "core";
import { SsrCookieService } from "ngx-cookie-service-ssr";


type ApplicationState = {
    isLogged: boolean;
    user: UserInfo | undefined | null,
    token: string | undefined,
    refreshToken?: string
    theme: ThemeState
}

const initialState: ApplicationState = {
    isLogged: false,
    token: undefined,
    user: null,
    refreshToken: undefined,
    theme: {
        preset: 'Aura',
        primary: 'cyan',
        surface: 'neutral',
        darkTheme: false,
    }
}

@Injectable({ providedIn: 'root' })
export class ApplicationStore extends signalStore(
    withState(initialState),
    withMethods((store) => ({
        updateToken(token: string): void {
            patchState(store, { token: token });
        },
        updateIsLogin(isLogged: boolean) {
            patchState(store, { isLogged: isLogged });
        },
        updateUser(newUser: UserInfo | undefined) {
            patchState(store, { user: newUser });
        },
        updateTheme(newTheme: ThemeState) {
            patchState(store, { theme: newTheme })
        },
        resetStore(): void {
            patchState(store, initialState);
        }
    })),
    withStorage('appstate', () => sessionStorage),
    withHooks({
        onInit(store) {
            const platformId = inject(PLATFORM_ID);
            const cookieService = inject(SsrCookieService);
            effect(() => {
                const state = getState(store);
                if (isPlatformBrowser(platformId)) {
                    cookieService.set('token', store.token()!);
                }
            });
            if (isPlatformServer(platformId)) {
          /*      var req = inject(REQUEST);
                if (store.isLogged()) return;
                var cookiesHeader = req?.headers.get("cookie");
                var cookies = cookiesHeader?.split(';').map(
                    cookie => {
                        var split = cookie.split('=');
                        return { key: split[0], value: split[1] }
                    }
                );
                var token = cookies?.filter(f => f.key === 'token')[0];*/
                var token=cookieService.get('token');
                try {
                    if (!!token) {
                        let decoded = jwtDecode(token)
                        store.updateIsLogin(true);
                        store.updateToken(token);
                        let user: UserInfo = {
                            login: decoded["unique_name"],
                            fullname: decoded["fullName"],
                            role: decoded["role"],
                            id: decoded["userId"],
                            canDelete: decoded["canDelete"],
                            group: decoded["group"]
                        }
                        store.updateUser(user);
                    }

                } catch (error) {

                }
            }
        },
    })

) { };

