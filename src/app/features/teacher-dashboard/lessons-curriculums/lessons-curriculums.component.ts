import { Component, OnInit, OnDestroy } from '@angular/core';
import { LearningOutcomesService } from '../../../core/services/teacher-dashboard-services/learning-outcomes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonsCurriculums, LessonsCurriculumsPagination, LessonsCurriculumsPayload } from '../../../core/models/teacher-dashboard-models/lesson-curriculums.model';
import { TranslateModule } from '@ngx-translate/core';
import { LessonCardsComponent } from '../../../shared/components/lesson-cards/lesson-cards.component';
import { SkillSummaryComponent, SkillSummaryData } from '../../../shared/components/skill-summary/skill-summary.component';
import { HeaderService } from '../../../core/services/header-services/header.service';
import { PaginatorState } from 'primeng/paginator';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { SkeletonComponent } from "../../../shared/components/skeleton/skeleton.component";
import { SkillActivationModalComponent } from "../../../shared/components/skill-activation-modal/skill-activation-modal.component";
import { Section } from '../../../core/models/header-models/header.model';
import { Lessons } from '../../../core/models/teacher-dashboard-models/lessons.model';
import { SkillCurriculum } from '../../../core/models/teacher-dashboard-models/skill-curriculum.model';
import { Statistics, StatisticsResponse } from '../../../core/models/teacher-dashboard-models/statistics.model';
import { StatisticsEnum } from '../../../core/models/shared-models/enums';
import { SkillsStatisticsService } from '../../../core/services/skills/skills-statistics.service';

@Component({
  selector: 'app-lessons-curriculums',
  imports: [LessonCardsComponent, TranslateModule, SkillSummaryComponent, PaginationComponent, SkeletonComponent],
  templateUrl: './lessons-curriculums.component.html',
  styleUrl: './lessons-curriculums.component.scss',
})
export class LessonsCurriculumsComponent implements OnInit, OnDestroy {  // Implement OnDestroy
  private refreshSubscription!: Subscription; // Mark subscription as private to avoid accidental changes

  curriculums: LessonsCurriculumsPagination = new LessonsCurriculumsPagination();
  curriculumsPayload: LessonsCurriculumsPayload = new LessonsCurriculumsPayload();
  lessonId: number;
  summaryData: SkillSummaryData = {
    allSkills: 0,
    activeSkills: 0,
    questionSolved: 0,
    timeSpent: 0,
  };
  first: number = 0;
  skillToActivate: LessonsCurriculums | null = null;
  sections: Section[] = [];
  statistics: StatisticsResponse[] = [];

  constructor(
    private learningOutcomesService: LearningOutcomesService,
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private sharedService: SharedService,
    private router: Router,
    private statisticsService: SkillsStatisticsService
  ) { }

  ngOnInit(): void {
    this.refreshSubscription = this.sharedService.refresh$.subscribe((res) => {
      if (res) {
        this.route.paramMap.subscribe((params) => {
          this.lessonId = this.sharedService.getId('lessonId');  // Ensuring non-null 'id'
          this.sections = this.headerService.sectionsArray;
          this.getCurriculums();
          this.getStatistics();
        });
      }
    });
  }

  getStatistics() {
    let model: Statistics = {
      courseSectionId: this.headerService.selectedSectionId,
      type: StatisticsEnum.Lesson,
      id: this.curriculumsPayload.lessonId
    }
    this.statisticsService.getStatistics(model).subscribe(res => {
      if (res.success) {
        this.statistics = res.result
      }
    })
  }

  onSearchChange($event: string) {
    this.curriculumsPayload.searchValue = $event;
    this.getCurriculums()
  }

  ngOnDestroy(): void {  // Unsubscribe in ngOnDestroy
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();  // Unsubscribe to avoid memory leaks
    }
  }

  getCurriculums() {
    if (this.sharedService.getPageState('LessonsCurriculumsComponent')) {
      let pageNumber = this.sharedService.getPageState('LessonsCurriculumsComponent');
      this.curriculumsPayload.pageNumber = pageNumber;
      this.first = (pageNumber - 1) * this.curriculumsPayload.pageSize;
    }
    this.curriculumsPayload.lessonId = this.lessonId;
    this.curriculumsPayload.courseSectionId = this.headerService.selectedSectionId;
    this.learningOutcomesService
      .lessonsCurriculums(this.curriculumsPayload)
      .subscribe((res) => {
        if (res) {
          this.curriculums = res.result;
        }
      });
  }

  clickedCard(card: Lessons | LessonsCurriculums | SkillCurriculum) {
    this.sharedService.pushTitle((card as LessonsCurriculums).name)
    const curriculumId = (card as LessonsCurriculums).curriculumLearningOutcomeId;
    this.sharedService.saveId('domainId', 0);
    this.sharedService.saveId('curriculumId', curriculumId);
    this.router.navigate(['/features/semesters/single-skill']);
  }

  nextPage($event: PaginatorState) {
    this.curriculumsPayload.pageNumber = $event.page;
    this.sharedService.savePageState('LessonsCurriculumsComponent', $event.page);
    this.first = $event.first;
    this.getCurriculums();
  }
}
