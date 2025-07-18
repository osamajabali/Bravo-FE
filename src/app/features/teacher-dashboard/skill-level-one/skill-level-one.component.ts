import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { SkillSummaryData, SkillSummaryComponent } from '../../../shared/components/skill-summary/skill-summary.component';
import { Subscription } from 'rxjs';
import { SingleSkill } from '../../../core/models/teacher-dashboard-models/single-skill';
import { Level } from '../../../core/models/teacher-dashboard-models/students.model';
import { TranslateModule } from '@ngx-translate/core';
import { StatsService } from '../../../core/services/teacher-dashboard-services/stats.service';
import { DomainRequest } from '../../../core/models/teacher-dashboard-models/stats.model';
import { HeaderService } from '../../../core/services/header-services/header.service';
import { SkillsCardsComponent } from "../../../shared/components/skills-cards/skills-cards.component";
import { LessonCardsComponent } from "../../../shared/components/lesson-cards/lesson-cards.component";
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { SkillCurriculum, SkillCurriculumPagination } from '../../../core/models/teacher-dashboard-models/skill-curriculum.model';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { PaginatorState } from 'primeng/paginator';
import { SpinnerService } from '../../../core/services/shared-services/spinner.service';
import { Section } from '../../../core/models/header-models/header.model';
import { LessonsCurriculums } from '../../../core/models/teacher-dashboard-models/lesson-curriculums.model';
import { Lessons } from '../../../core/models/teacher-dashboard-models/lessons.model';
import { Statistics, StatisticsResponse } from '../../../core/models/teacher-dashboard-models/statistics.model';
import { StatisticsEnum } from '../../../core/models/shared-models/enums';
import { SkillsStatisticsService } from '../../../core/services/skills/skills-statistics.service';

@Component({
  selector: 'app-skill-level-one',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    InputTextModule,
    OverlayPanelModule,
    ButtonModule,
    DialogModule,
    TranslateModule,
    SkillsCardsComponent,
    LessonCardsComponent,
    PaginationComponent,
    SkillSummaryComponent
  ],
  templateUrl: './skill-level-one.component.html',
  styleUrl: './skill-level-one.component.scss',
})
export class SkillLevelOneComponent implements OnInit, OnDestroy {  // Implement OnDestroy
  curriculumId: number | null = null;
  activateSkill: boolean = false;
  showUserDrower: boolean = false;
  showSmartBoard: boolean = false;
  currentSkillUsers: any = null;
  curriculumsPayload: DomainRequest = new DomainRequest();
  nextRoute: string = '/features/skills/skills-level-two';
  private refreshSubscription!: Subscription;

  skillSummaryData: SkillSummaryData = {
    allSkills: 25,
    activeSkills: 10,
    questionSolved: 10,
    timeSpent: 10,
  };
  domainId: number = 1;
  levels: Level[] = [];
  skillToActivate: SingleSkill | null = null;
  router: Router = inject(Router);
  skillCurriculum: SkillCurriculumPagination = new SkillCurriculumPagination();
  first: number = 0;
  sections: Section[] = [];
  statistics: StatisticsResponse[] = [];

  constructor(
    private statsService: StatsService,
    private headerService: HeaderService,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private spinnerService: SpinnerService,
    private statisticsService: SkillsStatisticsService,
  ) { }

  ngOnInit(): void {
    this.sharedService.nextRoute = this.nextRoute;
    this.sections = this.headerService.sectionsArray;
    if (localStorage.getItem('selectedItems')) {
      this.getSkills();
      this.getStatistics();
    }
    let check = this.sharedService.getSelectedItems()?.selectedGradeId == 0;
    this.refreshSubscription = this.sharedService.refresh$.subscribe(res => {
      if (((res == 'trigger') && check) || res == 'refresh') {
        this.getSkills();
        this.getStatistics();
      }
    });
  }

  ngOnDestroy(): void {  // Unsubscribe in ngOnDestroy
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();  // Unsubscribe to avoid memory leaks
    }
  }

  getSkills() {
    this.spinnerService.show();
    this.domainId = this.sharedService.getId('skillDomainId');
    this.curriculumsPayload.domainId = this.domainId;

    if (this.sharedService.getPageState('SkillLevelOneComponent')) {
      let pageNumber = this.sharedService.getPageState('SkillLevelOneComponent');
      this.curriculumsPayload.pageNumber = pageNumber;
      this.first = (pageNumber - 1) * this.curriculumsPayload.pageSize;
    }
    this.curriculumsPayload.courseSectionId = this.headerService.selectedSectionId;
    this.statsService.getDomainSkills(this.curriculumsPayload).subscribe(res => {
      if (res.success) {
        this.skillCurriculum = res.result;
        this.spinnerService.hide();
      }
    });
  }

  getStatistics() {
    let model: Statistics = {
      courseSectionId: this.headerService.selectedSectionId,
      type: StatisticsEnum.Domain,
      id: this.curriculumsPayload.domainId
    }
    this.statisticsService.getStatistics(model).subscribe(res => {
      if (res.success) {
        this.statistics = res.result
      }
    })
  }

  onSearchChange($event: string) {
    this.curriculumsPayload.searchValue = $event;
    this.sharedService.savePageState('SkillLevelOneComponent', 1)
    this.getSkills()
  }

  clickedCard(card: Lessons | LessonsCurriculums | SkillCurriculum) {
    const domainId = (card as SkillCurriculum).id;
    this.sharedService.pushTitle((card as SkillCurriculum).domainName);
    this.sharedService.saveId('SkillLevelOneDomainId', domainId);
    sessionStorage.removeItem('SkillLevelTwoComponent');
    this.router.navigate([this.sharedService.nextRoute]);
  }

  nextPage($event: PaginatorState) {
    this.curriculumsPayload.pageNumber = $event.page;
    this.sharedService.savePageState('SkillLevelOneComponent', $event.page);
    this.first = $event.first;
    this.getSkills();
  }
}
