import { TestBed } from '@angular/core/testing';
import { jest } from '@jest/globals';

import { ApplicationStore } from 'src/app/state/applicationStore';

describe('ApplicationStore - Persistence', () => {
  let store: ApplicationStore;

  beforeEach(() => {
    jest.restoreAllMocks();

    const savedState = {
      isLogged: true,
      token: 't1',
      user: null,
      refrehhToken: 'r1',
    };

    jest.spyOn(window.localStorage, 'getItem').mockReturnValue(JSON.stringify(savedState));
    jest.spyOn(window.localStorage, 'setItem').mockImplementation(() => {});

    TestBed.configureTestingModule({
      providers: [ApplicationStore],
    });

    store = TestBed.inject(ApplicationStore);
  });

  it('should_load_persisted_state_on_init_from_local_storage', () => {
    expect(window.localStorage.getItem).toHaveBeenCalledWith('applicationState');

    expect(store.isLogged()).toBe(true);
    expect(store.token()).toBe('t1');
    expect(store.user()).toBeNull();
    expect(store.refrehhToken()).toBe('r1');
  });
})