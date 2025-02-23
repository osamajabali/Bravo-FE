import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeveledDisplayComponent } from './leveled-display.component';

describe('LeveledDisplayComponent', () => {
  let component: LeveledDisplayComponent;
  let fixture: ComponentFixture<LeveledDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeveledDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeveledDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
