import { Injectable } from "@angular/core";
import { withAppShell } from "@angular/ssr";
import { patchState, signalState, signalStore, withHooks, withMethods, withState } from "@ngrx/signals";
import { withStorage } from "@larscom/ngrx-signals-storage";
import { User } from "models/user";
import { UserInfo } from "models/user-info";
import { ThemeState } from "models/themeState";

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
            patchState(store, {theme: newTheme})
        }
    })),
    withStorage('applicationStorage', () => sessionStorage)

) { };


