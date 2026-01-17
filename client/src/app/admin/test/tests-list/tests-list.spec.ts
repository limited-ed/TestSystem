import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsList } from './tests-list';

describe('TestsList', () => {
  let component: TestsList;
  let fixture: ComponentFixture<TestsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
