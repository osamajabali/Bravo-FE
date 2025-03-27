import { Component, OnInit, OnDestroy } from '@angular/core';
import { Lessons, LessonsPagination, LessonsPayload } from '../../../core/models/teacher-dashboard-models/lessons.model';
import { LearningOutcomesService } from '../../../core/services/teacher-dashboard-services/learning-outcomes.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LessonCardsComponent } from '../../../shared/components/lesson-cards/lesson-cards.component';
import { SkillSummaryComponent, SkillSummaryData } from '../../../shared/components/skill-summary/skill-summary.component';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { HeaderService } from '../../../core/services/header-services/header.service';
import { PaginatorState } from 'primeng/paginator';
import { Subscription } from 'rxjs';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { SkeletonComponent } from "../../../shared/components/skeleton/skeleton.component";
import { Section } from '../../../core/models/header-models/header.model';

@Component({
  selector: 'app-lessons',
  imports: [LessonCardsComponent, TranslateModule, SkillSummaryComponent, PaginationComponent, SkeletonComponent],
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.scss',
})
export class LessonsComponent implements OnInit, OnDestroy { // Implement OnDestroy
  private refreshSubscription!: Subscription; // Mark subscription as private to avoid accidental changes
  lessons: LessonsPagination = new LessonsPagination();
  lessonPayload: LessonsPayload = new LessonsPayload();
  summaryData: SkillSummaryData = {
    allSkills: 0,
    activeSkills: 0,
    questionSolved: 0,
    timeSpent: 0,
  };
  first: number = 0;
  skillToActivate: Lessons | null = null;
  sections: Section[] = [];


  constructor(
    private learningOutcomesService: LearningOutcomesService,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private headerService: HeaderService
  ) { }

  ngOnInit(): void {
    this.refreshSubscription = this.sharedService.refresh$.subscribe((res) => {
      if (res) {
        this.route.paramMap.subscribe((params) => {
          
          this.lessonPayload.unitId = parseInt(params.get('id')!);
          this.sections = this.headerService.sectionsArray;
          this.getLessons();
        });
      }
    });
  }

  ngOnDestroy(): void { // Unsubscribe in ngOnDestroy
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe(); // Unsubscribe to avoid memory leaks
    }
  }

  getLessons() {
    this.lessonPayload.pageSize = this.sharedService.pagination.pageSize;
    this.lessonPayload.courseSectionId = this.headerService.selectedSectionId;
    this.learningOutcomesService
      .getUnitsLessons(this.lessonPayload)
      .subscribe((res) => {
        if (res.success) {
          this.lessons = res.result;
        }
      });
  }

  _activateSkill() {
    // this.getLessons();
  }

  nextPage($event: PaginatorState) {
    this.lessonPayload.pageNumber = $event.page;
    this.first = $event.first;
    this.getLessons();
  }
}
