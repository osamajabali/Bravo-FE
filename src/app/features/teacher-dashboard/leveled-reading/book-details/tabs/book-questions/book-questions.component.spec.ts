import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookQuestionsComponent } from './book-questions.component';

describe('BookQuestionsComponent', () => {
  let component: BookQuestionsComponent;
  let fixture: ComponentFixture<BookQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookQuestionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
