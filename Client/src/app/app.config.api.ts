import { InjectionToken, Provider } from "@angular/core";
import { environment } from "../environments/environment";

export const ApiConfiguration = {
  apiEndpoints: {
    login: '/api/login/',
    categories: '/api/category/',
    groups: '/api/group/',
    users: '/api/user/',
    questions: '/api/question/',
    cource: '/api/cource/',
    test: '/api/test/',
    testForUser: '/api/testforuser/',
    startTest: '/api/starttest/',
    endTest: '/api/endtest/',
    testResult: '/api/testresult/'

  },
  apiHost: environment.apiServer
}

export const API_CONFIG = new InjectionToken<typeof ApiConfiguration>('API_CONFIG');

export function provideApiConfig(): Provider {
    return {
        provide: API_CONFIG,
        useValue: ApiConfiguration
    }
}