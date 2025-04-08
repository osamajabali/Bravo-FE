import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import {
  SkillSummaryData,
} from '../../../shared/components/skill-summary/skill-summary.component';
import { Subscription } from 'rxjs';
import { SingleSkill } from '../../../core/models/teacher-dashboard-models/single-skill';
import { Level } from '../../../core/models/teacher-dashboard-models/students.model';
import { TranslateModule } from '@ngx-translate/core';
import { LessonCardsComponent } from '../../../shared/components/lesson-cards/lesson-cards.component';
import { SkillsCardsComponent } from '../../../shared/components/skills-cards/skills-cards.component';
import { DomainRequest } from '../../../core/models/teacher-dashboard-models/stats.model';
import { HeaderService } from '../../../core/services/header-services/header.service';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { StatsService } from '../../../core/services/teacher-dashboard-services/stats.service';
import { SkillCurriculum, SkillCurriculumPagination } from '../../../core/models/teacher-dashboard-models/skill-curriculum.model';
import { PaginatorState } from 'primeng/paginator';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { SpinnerService } from '../../../core/services/shared-services/spinner.service';
import { Section } from '../../../core/models/header-models/header.model';
import { LessonsCurriculums } from '../../../core/models/teacher-dashboard-models/lesson-curriculums.model';
import { Lessons } from '../../../core/models/teacher-dashboard-models/lessons.model';

@Component({
  selector: 'app-skill-level-two',
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
    PaginationComponent
  ],
  templateUrl: './skill-level-two.component.html',
  styleUrl: './skill-level-two.component.scss',
})
export class SkillLevelTwoComponent {
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

  constructor(
    private statsService: StatsService,
    private headerService: HeaderService,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit(): void {
    this.sharedService.nextRoute = this.nextRoute;
    this.refreshSubscription = this.sharedService.refresh$.subscribe((res) => {
      if (res) {
        this.first = 0;
        this.curriculumsPayload =new DomainRequest();
        this.skillCurriculum = new SkillCurriculumPagination();
        this.sections = this.headerService.sectionsArray
        this.route.paramMap.subscribe((params) => {
          this.getSkills();
        });
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
    this.route.paramMap.subscribe(params => {
      this.domainId = parseInt(params.get('domainId') || '0');
      console.log('domainId:', this.domainId);
      this.curriculumsPayload.domainId = this.domainId;
    });
    if (this.sharedService.getPageState(`SkillLevelTwoComponent ${this.domainId}`)) {
      let pageNumber = this.sharedService.getPageState(`SkillLevelTwoComponent ${this.domainId}`);
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

    clickedCard(card: Lessons | LessonsCurriculums | SkillCurriculum) {
      this.domainId = (card as SkillCurriculum).id;
      this.sharedService.pushTitle((card as SkillCurriculum).domainName + ' - ' + this.sharedService.translate('SKILLS'))
      this.router.navigate([this.sharedService.nextRoute, this.domainId]);
    }
    

  nextPage($event: PaginatorState) {
    this.curriculumsPayload.pageNumber = $event.page;
    this.sharedService.savePageState(`SkillLevelTwoComponent ${this.domainId}`, $event.page);
    this.first = $event.first;
    this.getSkills();
  }
}
