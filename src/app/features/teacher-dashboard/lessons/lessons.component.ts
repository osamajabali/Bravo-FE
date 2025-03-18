import { Component, OnInit } from '@angular/core';
import { LessonsPagination, LessonsPayload, LessonWithActive } from '../../../core/models/teacher-dashboard-models/lessons.model';
import { LearningOutcomesService } from '../../../core/services/teacher-dashboard-services/learning-outcomes.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LessonCardsComponent } from '../../../shared/components/lesson-cards/lesson-cards.component';
import { SkillSummaryComponent, SkillSummaryData } from '../../../shared/components/skill-summary/skill-summary.component';
import { SharedService } from '../../../core/services/shared-services/shared.service';
@Component({
  selector: 'app-lessons',
  imports: [LessonCardsComponent, TranslateModule, SkillSummaryComponent],
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.scss',
})
export class LessonsComponent implements OnInit {
  lessons: LessonsPagination = new LessonsPagination();
  lessonPayload: LessonsPayload = new LessonsPayload();
  summaryData: SkillSummaryData = {
    allSkills: 0,
    activeSkills: 0,
    questionSolved: 0,
    timeSpent: 0,
  };

  constructor(
    private learningOutcomesService: LearningOutcomesService,
    private route: ActivatedRoute,
    private sharedService : SharedService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.lessonPayload.unitId = parseInt(params.get('id'));
      this.getLessons();
    });
  }

  getLessons() {
    this.lessonPayload.pageSize = this.sharedService.pagination.pageSize;
    this.learningOutcomesService
      .getUnitsLessons(this.lessonPayload)
      .subscribe((res) => {
        if (res.success) {
          this.lessons = res.result;
        }
      });
  }

  nextPage($event: number) {
    this.lessonPayload.pageNumber = $event;
    this.getLessons();
  }
}
