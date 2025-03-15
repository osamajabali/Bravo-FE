import { Component, OnInit } from '@angular/core';
import { LessonWithActive } from '../../../core/models/teacher-dashboard-models/lessons.model';
import { LearningOutcomesService } from '../../../core/services/teacher-dashboard-services/learning-outcomes.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LessonCardsComponent } from '../../../shared/components/lesson-cards/lesson-cards.component';
import { SkillSummaryComponent, SkillSummaryData } from '../../../shared/components/skill-summary/skill-summary.component';
@Component({
  selector: 'app-lessons',
  imports: [LessonCardsComponent, TranslateModule, SkillSummaryComponent],
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.scss',
})
export class LessonsComponent implements OnInit {
  lessons: LessonWithActive[] = [];
  unitId: number | null = null;
  summaryData: SkillSummaryData = {
    allSkills: 0,
    activeSkills: 0,
    questionSolved: 0,
    timeSpent: 0,
  };

  constructor(
    private learningOutcomesService: LearningOutcomesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.unitId = parseInt(params.get('id'));
      this.getLessons();
    });
  }

  getLessons() {
    this.learningOutcomesService
      .getUnitsLessons(this.unitId)
      .subscribe((res) => {
        if (res.success) {
          this.lessons = res.result.lessons;
        }
      });
  }
}
