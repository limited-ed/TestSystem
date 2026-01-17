import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserResult } from './user-result';

describe('UserResult', () => {
  let component: UserResult;
  let fixture: ComponentFixture<UserResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserResult]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserResult);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
