import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LearningOutcomesService } from '../../../core/services/teacher-dashboard-services/learning-outcomes.service';
import { HeaderService } from '../../../core/services/header-services/header.service';
import { combineLatest, Subscription } from 'rxjs';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { SingleSkill, SingleSkillPagination, SingleSkillPayload } from '../../../core/models/teacher-dashboard-models/single-skill';
import { Level } from '../../../core/models/teacher-dashboard-models/students.model';
import { SpinnerService } from '../../../core/services/shared-services/spinner.service';
import { SkillsCardsComponent } from "../../../shared/components/skills-cards/skills-cards.component";
import { PaginatorState } from 'primeng/paginator';
import { SkillSummaryComponent, SkillSummaryData } from "../../../shared/components/skill-summary/skill-summary.component";
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { SkeletonComponent } from "../../../shared/components/skeleton/skeleton.component";
import { TranslateModule } from '@ngx-translate/core';
import { Section } from '../../../core/models/header-models/header.model';
import { Statistics, StatisticsResponse } from '../../../core/models/teacher-dashboard-models/statistics.model';
import { StatisticsEnum } from '../../../core/models/shared-models/enums';
import { SkillsStatisticsService } from '../../../core/services/skills/skills-statistics.service';

@Component({
  selector: 'app-single-skill',
  imports: [
    SkillsCardsComponent,
    SkillSummaryComponent,
    PaginationComponent,
    SkeletonComponent,
    TranslateModule
  ],
  templateUrl: './single-skill.component.html',
  styleUrl: './single-skill.component.scss',
})
export class SingleSkillComponent implements OnInit, OnDestroy {
  skills: SingleSkillPagination = new SingleSkillPagination();
  skillsPayload: SingleSkillPayload = new SingleSkillPayload();
  curriculumId: number | null = null;
  activateSkill: boolean;
  showUserDrower: boolean;
  showSmartBoard: boolean;
  currentSkillUsers: any = null;
  private refreshSubscription!: Subscription;

  domainId: number;
  levels: Level[] = [];
  skillToActivate: SingleSkill | null = null;
  first: number = 0;

  skillSummaryData: SkillSummaryData = {
    allSkills: 25,
    activeSkills: 10,
    questionSolved: 10,
    timeSpent: 10,
  };
  sections: Section[] = [];
  statistics: StatisticsResponse[] = [];

  constructor(
    private learningOutcomesService: LearningOutcomesService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private statisticsService: SkillsStatisticsService
  ) { }

  ngOnInit(): void {
    // Subscribe to both paramMap and refresh$
    this.refreshSubscription = combineLatest([
      this.route.paramMap,
      this.sharedService.refresh$,
    ]).subscribe(([params]) => {
      this.domainId = this.sharedService.getId('domainId');
      this.curriculumId = this.sharedService.getId('curriculumId');
      this.sections = this.headerService.sectionsArray;
      this.getSkills();
      this.getStatistics();
    });
  }

  getStatistics() {
    let model: Statistics = {
      courseSectionId: this.headerService.selectedSectionId,
      type: StatisticsEnum.Curriculum,
      id: this.domainId ? this.domainId : this.curriculumId
    }
    this.statisticsService.getStatistics(model).subscribe(res => {
      if (res.success) {
        this.statistics = res.result
      }
    })
  }

  onSearchChange($event: string) {
    this.skillsPayload.searchValue = $event;
    this.getSkills()
  }

  ngOnDestroy(): void {
    // Unsubscribe from any subscriptions to avoid memory leaks
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  getSkills() {
    if (this.sharedService.getPageState('SingleSkillComponent')) {
      let pageNumber = this.sharedService.getPageState('SingleSkillComponent');
      this.skillsPayload.pageNumber = pageNumber;
      this.first = (pageNumber - 1) * this.skillsPayload.pageSize;
    }
    this.skillsPayload.courseSectionId = this.headerService.selectedSectionId;
    this.skillsPayload.curriculumLearningOutcomeId = this.curriculumId ? this.curriculumId : 0
    this.skillsPayload.domainId = this.domainId ? this.curriculumId : 0

    this.learningOutcomesService
      .lessonsCurriculumsSkills(this.skillsPayload)
      .subscribe((res) => {
        if (res.success) {
          this.skills = res.result;
        }
      });
  }

  nextPage($event: PaginatorState) {
    this.skillsPayload.pageNumber = $event.page;
    this.sharedService.savePageState('SingleSkillComponent', $event.page);
    this.first = $event.first;
    this.getSkills();
  }
}
