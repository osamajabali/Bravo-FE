import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Unit } from '../../../core/models/teacher-dashboard-models/units.model';
import { Lessons } from '../../../core/models/teacher-dashboard-models/lessons.model';
import { Router } from '@angular/router';
import { LessonsCurriculums } from '../../../core/models/teacher-dashboard-models/lesson-curriculums.model';
import { SkeletonComponent } from "../skeleton/skeleton.component";
import { PaginationComponent } from "../pagination/pagination.component";
import { PaginatorState } from 'primeng/paginator';
import { SharedService } from '../../../core/services/shared-services/shared.service';

@Component({
  selector: 'app-unit-cards',
  imports: [SkeletonComponent, PaginationComponent],
  templateUrl: './unit-cards.component.html',
  styleUrl: './unit-cards.component.scss'
})
export class UnitCardsComponent {
  
  @Input() cards: (Unit | Lessons | LessonsCurriculums)[] = [];
  @Input() first: number = 1;
  @Input() rows: number = 0;
  @Input() totalRecords: number = 0;
  @Output() paginatorState = new EventEmitter<PaginatorState>();
  @Output() cardClick = new EventEmitter<(Unit | Lessons | LessonsCurriculums)>();
  
  constructor(private router: Router, private sharedService : SharedService) {
    if (this.cards.length) {
      this.checkType(this.cards[0])
    }
  }
  
  onPageChange($event: PaginatorState) {
  this.paginatorState.emit($event)
  }

  checkType(card: Unit | Lessons | LessonsCurriculums): 'unit' | 'lesson' | 'curriculum' {
    if (this.isUnit(card)) return 'unit';
    if (this.isLesson(card)) return 'lesson';
    return 'curriculum';
  }

  isUnit(card: Unit | Lessons | LessonsCurriculums): card is Unit {
    return 'unitLabelName' in card; // Type guard to check if card is a Unit
  }

  isLesson(card: Unit | Lessons | LessonsCurriculums): card is Lessons {
    return 'lessonName' in card; // Type guard to check if card is a Lesson
  }

  clickedCard(card: Unit | Lessons | LessonsCurriculums) {
    this.cardClick.emit(card)
    if ((card as Unit).unitId) {
      // this.sharedService.pushTitle((card as Unit).unitLabelName + ' - ' +this.sharedService.translate('LESSONS'))
      // this.router.navigate(['/features/semesters/lessons', (card as Unit).unitId]);
    } else if ((card as Lessons).lessonId) {
      this.sharedService.pushTitle((card as Lessons).name + ' - ' +this.sharedService.translate('CURRICULUMS'))
      this.router.navigate(['/features/semesters/lessons-curriculums', (card as Lessons).lessonId]);
    } else {
      const curriculumId = (card as LessonsCurriculums).curriculumLearningOutcomeId;
      this.sharedService.pushTitle((card as LessonsCurriculums).name  + ' - ' +this.sharedService.translate('SKILLS'))
      this.router.navigate(['/features/semesters/single-skill', 0, curriculumId]);

    }
  }
}
