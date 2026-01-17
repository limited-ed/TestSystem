import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAddCategory } from './test-add-category';

describe('TestAddCategory', () => {
  let component: TestAddCategory;
  let fixture: ComponentFixture<TestAddCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestAddCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestAddCategory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
