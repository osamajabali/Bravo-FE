import { Component, Input } from '@angular/core';
import { LessonWithActive } from '../../../core/models/teacher-dashboard-models/lessons.model';
import { Router } from '@angular/router';
import { CurriculumWithActive } from '../../../core/models/teacher-dashboard-models/lesson-curriculums.model';
import { SkeletonComponent } from '../skeleton/skeleton.component';
import { SkillActivationModalComponent } from '../skill-activation-modal/skill-activation-modal.component';

@Component({
  selector: 'app-lesson-cards',
  imports: [SkeletonComponent, SkillActivationModalComponent],
  templateUrl: './lesson-cards.component.html',
  styleUrl: './lesson-cards.component.scss',
})
export class LessonCardsComponent {
  @Input() cards: (LessonWithActive | CurriculumWithActive)[] = [];
  activateSkill: boolean = false;
  skillToActivate: LessonWithActive | CurriculumWithActive | null = null;

  constructor(private router: Router) {
    if (this.cards.length) {
      this.checkType(this.cards[0]);
    }
  }

  checkType(card: LessonWithActive | CurriculumWithActive): 'lesson' | 'curriculum' {
    if (this.isLesson(card)) return 'lesson';
    return 'curriculum';
  }

  isLesson(card: LessonWithActive | CurriculumWithActive): card is LessonWithActive {
    return 'lessonName' in card;
  }

  getViewButtonText(card: LessonWithActive | CurriculumWithActive): string {
    if ((card as LessonWithActive).lessonId) return 'View Curriculum';
    return 'View BB Skill';
  }

  toggleActive(card: LessonWithActive | CurriculumWithActive) {
    this.skillToActivate = card;
    this.activateSkill = !this.activateSkill;
  }

  _activateSkill() {
    this.activateSkill = !this.activateSkill;
    this.skillToActivate.isActive = !this.skillToActivate.isActive;
  }

  clickedCard(card: LessonWithActive | CurriculumWithActive) {
    if ((card as LessonWithActive).lessonId) {
      this.router.navigate([
        '/features/lessons-curriculums',
        (card as LessonWithActive).lessonId,
      ]);
    } else {
      const curriculumId = (card as CurriculumWithActive)
        .curriculumLearningOutcomeId;
      this.router.navigate(['/features/single-skill', 0, curriculumId]);
    }
  }
}
