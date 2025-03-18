import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SmartBoardComponent } from '../../../shared/components/smart-board/smart-board.component';
import { UserDrawerComponent } from '../../../shared/components/user-drawer/user-drawer.component';
import { FormsModule } from '@angular/forms';
import {
  SkillSummaryComponent,
  SkillSummaryData,
} from '../../../shared/components/skill-summary/skill-summary.component';
import { Subscription } from 'rxjs';
import { SingleSkill } from '../../../core/models/teacher-dashboard-models/single-skill';
import { Level } from '../../../core/models/teacher-dashboard-models/students.model';
import { SkillActivationModalComponent } from '../../../shared/components/skill-activation-modal/skill-activation-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { StatsService } from '../../../core/services/teacher-dashboard-services/stats.service';
import { DomainRequest } from '../../../core/models/teacher-dashboard-models/stats.model';
import { HeaderService } from '../../../core/services/header-services/header.service';
import { SkillCurriculum } from '../../../core/models/teacher-dashboard-models/skill-curriculum.model';
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
    UserDrawerComponent,
    SmartBoardComponent,
    SkillSummaryComponent,
    SkillActivationModalComponent,
    TranslateModule,
  ],
  templateUrl: './skill-level-one.component.html',
  styleUrl: './skill-level-one.component.scss',
})
export class SkillLevelOneComponent {
  skills: SingleSkill[] = [];
  curriculumId: number | null = null;
  activateSkill: boolean = false;
  showUserDrower: boolean = false;
  showSmartBoard: boolean = false;
  currentSkillUsers: any = null;
  domainSkillsRequest: DomainRequest = new DomainRequest();
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
  skillCurriculum: SkillCurriculum[] = [];
  skillArray: any;
  curriculumArray: any;

  constructor(
    private statsService: StatsService,
    private headerService: HeaderService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getSkills();
  }

  toggleActive(skill: SingleSkill) {
    this.skillToActivate = skill;
    this.activateSkill = !this.activateSkill;
  }

  _activateSkill() {
    this.activateSkill = !this.activateSkill;
    if (this.skillToActivate) {
      this.skillToActivate.isEnabled = !this.skillToActivate.isEnabled;
    }
  }

  getSkills() {
    this.route.paramMap.subscribe((params) => {
      this.domainId = parseInt(params.get('domainId') || '0');
      console.log('domainId:', this.domainId);
    });
    this.domainSkillsRequest.courseSectionId =
      this.headerService.selectedSectionId;
    this.domainSkillsRequest.domainId = this.domainId;
    this.statsService
      .getDomainSkills(this.domainSkillsRequest)
      .subscribe((res) => {
        if (res.success) {
          this.skillCurriculum = res.result;
          this.skillCurriculum.forEach((item) => {
            if (item.isSkill) {
              this.skillArray.push(item); // Add to skillArray if isSkill is true
            } else {
              this.curriculumArray.push(item); // Add to curriculumArray if isSkill is false
            }
          });
        }
      });
  }

  getStudents = (learningOutcomeId: number) => {
    this.showUserDrower = true;
    this.levels = [];
  };

  viewAllSkills(learningOutcomeId: number) {
    this.router.navigate(['/features/skills-level-two']);
  }

  toggleFilterSection(section: FilterSection): void {
    section.expanded = !section.expanded;
  }

  toggleCheckbox(section: FilterSection, value: string): void {
    const index = section.selectedOptions.indexOf(value);

    if (index !== -1) {
      section.selectedOptions.splice(index, 1);
    } else {
      section.selectedOptions.push(value);
    }
  }
}

interface FilterSection {
  title: string;
  expanded: boolean;
  selectedOptions: string[];
}
