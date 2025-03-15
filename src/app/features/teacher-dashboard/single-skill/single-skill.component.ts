import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LearningOutcomesService } from '../../../core/services/teacher-dashboard-services/learning-outcomes.service';
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
import { HeaderService } from '../../../core/services/header-services/header.service';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { SingleSkill } from '../../../core/models/teacher-dashboard-models/single-skill';
import { Level } from '../../../core/models/teacher-dashboard-models/students.model';
import { SpinnerService } from '../../../core/services/shared-services/spinner.service';

@Component({
  selector: 'app-single-skill',
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
    SkillSummaryComponent
  ],
  templateUrl: './single-skill.component.html',
  styleUrl: './single-skill.component.scss',
})
export class SingleSkillComponent implements OnInit {
  skills: SingleSkill[] = [];
  curriculumId: number | null = null;
  activateSkill: boolean;
  showUserDrower: boolean;
  showSmartBoard: boolean;
  currentSkillUsers: any = null;
  private refreshSubscription!: Subscription;


  skillSummaryData: SkillSummaryData = {
    allSkills: 25,
    activeSkills: 10,
    questionSolved: 10,
    timeSpent: 10,
  };
  domainId: number;
  levels: Level[] = [];
  skillToActivate: SingleSkill | null = null;
  constructor(
    private learningOutcomesService: LearningOutcomesService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.domainId = parseInt(params.get('domainId'));
      this.curriculumId = parseInt(params.get('curriculumId'));
      console.log(
        'Domain ID:',
        this.domainId,
        'Curriculum ID:',
        this.curriculumId
      );
      this.getSkills();
    });

    this.refreshSubscription = this.sharedService.refresh$.subscribe(() => {
      this.getSkills();
    });
  }

  toggleActive(skill: SingleSkill) {
    this.skillToActivate = skill;
    this.activateSkill = !this.activateSkill;
  }

  _activateSkill() {
    this.activateSkill = !this.activateSkill;
    this.skillToActivate.isActive = !this.skillToActivate.isActive;
  }

  getSkills() {
    this.learningOutcomesService
      .lessonsCurriculumsSkills(
        this.headerService.selectedSectionId,
        this.domainId ? this.domainId : 0,
        this.curriculumId ? this.curriculumId : 0
      )
      .subscribe((res) => {
        if (res.success) {
          this.skills = res.result.learningOutcomes;
        }
      });
  }

  getStudents = (lerningOutcomeId: number) => {
    this.spinnerService.show();
    this.learningOutcomesService.getStudents(this.headerService.selectedSectionId , lerningOutcomeId).subscribe(res=>{
      if(res.success){
        this.spinnerService.hide()
        this.showUserDrower = true
        this.levels = res.result.students;
      }
    })
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
  options: FilterOption[];
  selectedOptions: string[];
}
