import { Component, Input } from '@angular/core';
import { Unit } from '../../../core/models/teacher-dashboard-models/units.model';
import { Lessons } from '../../../core/models/teacher-dashboard-models/lessons.model';
import { Router } from '@angular/router';
import { LessonsCurriculums } from '../../../core/models/teacher-dashboard-models/lesson-curriculums.model';
import { SkeletonComponent } from "../skeleton/skeleton.component";

@Component({
  selector: 'app-unit-cards',
  imports: [SkeletonComponent],
  templateUrl: './unit-cards.component.html',
  styleUrl: './unit-cards.component.scss'
})
export class UnitCardsComponent {
  
  @Input() cards: (Unit | Lessons | LessonsCurriculums)[] = [];

  constructor(private router : Router){
    if(this.cards.length){
      this.checkType(this.cards[0])
    }
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

  clickedCard(card : Unit | Lessons | LessonsCurriculums ) {
    if((card as Unit).unitId){
      this.router.navigate(['/features/lessons', (card as Unit).unitId]);
    }else if((card as Lessons).lessonId){
      this.router.navigate(['/features/lessons-curriculums', (card as Lessons).lessonId]);
    }
  }
}
