import { Component, OnInit } from '@angular/core';
import { LearningOutcomesService } from '../../../core/services/teacher-dashboard-services/learning-outcomes.service';
import { ActivatedRoute } from '@angular/router';
import { CurriculumWithActive, LessonsCurriculumsPagination, LessonsCurriculumsPayload } from '../../../core/models/teacher-dashboard-models/lesson-curriculums.model';
import { TranslateModule } from '@ngx-translate/core';
import { LessonCardsComponent } from '../../../shared/components/lesson-cards/lesson-cards.component';
import {
  SkillSummaryComponent,
  SkillSummaryData,
} from '../../../shared/components/skill-summary/skill-summary.component';
import { HeaderService } from '../../../core/services/header-services/header.service';
@Component({
  selector: 'app-lessons-curriculums',
  imports: [LessonCardsComponent, TranslateModule, SkillSummaryComponent],
  templateUrl: './lessons-curriculums.component.html',
  styleUrl: './lessons-curriculums.component.scss',
})
export class LessonsCurriculumsComponent implements OnInit {
  curriculums: LessonsCurriculumsPagination = new LessonsCurriculumsPagination();
  curriculumsPayload: LessonsCurriculumsPayload = new LessonsCurriculumsPayload();
  lessonId: number;
  summaryData: SkillSummaryData = {
    allSkills: 0,
    activeSkills: 0,
    questionSolved: 0,
    timeSpent: 0,
  };

  constructor(
    private learningOutcomesService: LearningOutcomesService,
    private route: ActivatedRoute,
    private headerService : HeaderService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.lessonId = parseInt(params.get('id'));
      this.getCurriculums();
    });
  }
  getCurriculums() {
    this.curriculumsPayload.leesonId = this.lessonId;
    this.curriculumsPayload.courseSectionId = this.headerService.selectedSectionId;
    this.learningOutcomesService
      .lessonsCurriculums(this.curriculumsPayload)
      .subscribe((res) => {
        if (res) {
          this.curriculums = res.result;
        }
      });
  }

  nextPage($event: number) {
    this.curriculumsPayload.pageNumber = $event;
    this.getCurriculums();
  }
}
