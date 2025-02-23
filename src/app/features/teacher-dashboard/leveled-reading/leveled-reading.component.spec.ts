import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeveledReadingComponent } from './leveled-reading.component';

describe('LeveledReadingComponent', () => {
  let component: LeveledReadingComponent;
  let fixture: ComponentFixture<LeveledReadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeveledReadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeveledReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
