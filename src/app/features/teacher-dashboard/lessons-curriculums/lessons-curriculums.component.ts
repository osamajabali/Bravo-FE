import { Component, OnInit } from '@angular/core';
import { LearningOutcomesService } from '../../../core/services/teacher-dashboard-services/learning-outcomes.service';
import { ActivatedRoute } from '@angular/router';
import { CurriculumWithActive } from '../../../core/models/teacher-dashboard-models/lesson-curriculums.model';
import { TranslateModule } from '@ngx-translate/core';
import { LessonCardsComponent } from '../../../shared/components/lesson-cards/lesson-cards.component';
import {
  SkillSummaryComponent,
  SkillSummaryData,
} from '../../../shared/components/skill-summary/skill-summary.component';
@Component({
  selector: 'app-lessons-curriculums',
  imports: [LessonCardsComponent, TranslateModule, SkillSummaryComponent],
  templateUrl: './lessons-curriculums.component.html',
  styleUrl: './lessons-curriculums.component.scss',
})
export class LessonsCurriculumsComponent implements OnInit {
  curriculums: CurriculumWithActive[] = [];
  lessonId: number;
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
      this.lessonId = parseInt(params.get('id'));
      this.getCurriculums();
    });
  }
  getCurriculums() {
    this.learningOutcomesService
      .lessonsCurriculums(this.lessonId)
      .subscribe((res) => {
        if (res) {
          this.curriculums = res.result.curriculums;
        }
      });
  }
}
