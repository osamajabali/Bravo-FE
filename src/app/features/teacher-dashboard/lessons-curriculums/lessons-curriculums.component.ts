import { Component, OnInit, OnDestroy } from '@angular/core';
import { LearningOutcomesService } from '../../../core/services/teacher-dashboard-services/learning-outcomes.service';
import { ActivatedRoute } from '@angular/router';
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

@Component({
  selector: 'app-lessons-curriculums',
  imports: [LessonCardsComponent, TranslateModule, SkillSummaryComponent, PaginationComponent, SkeletonComponent, SkillActivationModalComponent],
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
  activateSkill: boolean;
  skillToActivate: LessonsCurriculums | null = null;

  constructor(
    private learningOutcomesService: LearningOutcomesService,
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.refreshSubscription = this.sharedService.refresh$.subscribe((res) => {
      if (res) {
        this.route.paramMap.subscribe((params) => {
          this.lessonId = parseInt(params.get('id')!);  // Ensuring non-null 'id'
          this.getCurriculums();
        });
      }
    });
  }

  ngOnDestroy(): void {  // Unsubscribe in ngOnDestroy
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();  // Unsubscribe to avoid memory leaks
    }
  }

  getCurriculums() {
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

  _activateSkill() {
    this.activateSkill = !this.activateSkill;
    if (this.skillToActivate) {
      this.skillToActivate.isActive = !this.skillToActivate.isActive;
    }
  }

  nextPage($event: PaginatorState) {
    this.curriculumsPayload.pageNumber = $event.page;
    this.first = $event.first;
    this.getCurriculums();
  }
}
