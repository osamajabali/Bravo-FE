import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
    UserDrawerComponent,
    SmartBoardComponent,
    SkillSummaryComponent,
    SkillActivationModalComponent,
    TranslateModule,
  ],
  templateUrl: './skill-level-two.component.html',
  styleUrl: './skill-level-two.component.scss',
})
export class SkillLevelTwoComponent {
  skills: SingleSkill[] = [
    {
      learningOutcomeId: 1,
      learningOutcomeDisplayName: 'Basic Math',
      noOfStudentsEasy: 10,
      noOfStudentsMedium: 20,
      noOfStudentsHard: 15,
      isActive: true,
      activationDate: '2024-01-01',
      isSkill: true,
      numberOfSkills: 10,
    },
    {
      learningOutcomeId: 2,
      learningOutcomeDisplayName: 'Advanced Math',
      noOfStudentsEasy: 5,
      noOfStudentsMedium: 10,
      noOfStudentsHard: 8,
      isActive: false,
      activationDate: '2024-01-02',
      isSkill: true
    }
  ];
  curriculumId: number | null = null;
  activateSkill: boolean = false;
  showUserDrower: boolean = false;
  showSmartBoard: boolean = false;
  currentSkillUsers: any = null;
  private refreshSubscription!: Subscription;

  skillSummaryData: SkillSummaryData = {
    allSkills: 25,
    activeSkills: 10,
    questionSolved: 10,
    timeSpent: 10,
  };
  domainId: number = 1;
  levels: Level[] = [
    {
      levelId: 1,
      levelName: 'Beginner',
      studentsOfLevel: [
        { studentName: 'John Doe', currentLevelId: 1, isMastered: false, isInProgress: true },
        { studentName: 'Jane Smith', currentLevelId: 1, isMastered: false, isInProgress: true }
      ]
    },
    {
      levelId: 2,
      levelName: 'Intermediate',
      studentsOfLevel: [
        { studentName: 'Bob Wilson', currentLevelId: 2, isMastered: false, isInProgress: true },
        { studentName: 'Alice Brown', currentLevelId: 2, isMastered: false, isInProgress: true }
      ]
    }
  ];
  skillToActivate: SingleSkill | null = null;
  router: Router = inject(Router);

  constructor() {}

  ngOnInit(): void {
    // Using hardcoded data, no need for API calls
    this.domainId = 1;
    this.curriculumId = 1;
  }

  toggleActive(skill: SingleSkill) {
    this.skillToActivate = skill;
    this.activateSkill = !this.activateSkill;
  }

  _activateSkill() {
    this.activateSkill = !this.activateSkill;
    if (this.skillToActivate) {
      this.skillToActivate.isActive = !this.skillToActivate.isActive;
    }
  }

  getSkills() {
    // Using hardcoded data instead of API call
    this.skills = [
      {
        learningOutcomeId: 1,
        learningOutcomeDisplayName: 'Basic Math',
        noOfStudentsEasy: 10,
        noOfStudentsMedium: 20,
        noOfStudentsHard: 15,
        isActive: true,
        activationDate: '2024-01-01',
        isSkill: true
      },
      {
        learningOutcomeId: 2,
        learningOutcomeDisplayName: 'Advanced Math',
        noOfStudentsEasy: 5,
        noOfStudentsMedium: 10,
        noOfStudentsHard: 8,
        isActive: false,
        activationDate: '2024-01-02',
        isSkill: true
      }
    ];
  }

  getStudents = (learningOutcomeId: number) => {
    // Using hardcoded data instead of API call
    this.showUserDrower = true;
    this.levels = [
      {
        levelId: 1,
        levelName: 'Beginner',
        studentsOfLevel: [
          { studentName: 'John Doe', currentLevelId: 1, isMastered: false, isInProgress: true },
          { studentName: 'Jane Smith', currentLevelId: 1, isMastered: false, isInProgress: true }
        ]
      },
      {
        levelId: 2,
        levelName: 'Intermediate',
        studentsOfLevel: [
          { studentName: 'Bob Wilson', currentLevelId: 2, isMastered: false, isInProgress: true },
          { studentName: 'Alice Brown', currentLevelId: 2, isMastered: false, isInProgress: true }
        ]
      }
    ];
  };

  viewAllSkills(learningOutcomeId: number) {
    this.router.navigate(['/features/single-skill', 1, 0]);
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
