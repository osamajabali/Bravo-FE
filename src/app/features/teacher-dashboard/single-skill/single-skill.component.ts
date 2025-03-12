import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Lessons } from '../../../core/models/teacher-dashboard-models/lessons.model';
import { LearningOutcomesService } from '../../../core/services/teacher-dashboard-services/learning-outcomes.service';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SmartBoardComponent } from '../../../shared/components/smart-board/smart-board.component';
import { UserDrawerComponent } from '../../../shared/components/user-drawer/user-drawer.component';
import { FormsModule } from '@angular/forms';
import { SkillSummaryComponent, SkillSummaryData } from "../../../shared/components/skill-summary/skill-summary.component";
import { HeaderService } from '../../../core/services/header-services/header.service';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../core/services/shared-services/shared.service';

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
  lessons: Lessons[] = [];
  curriculumId: number | null = null;
  activateSkill: boolean;
  showUserDrower: boolean;
  showSmartBoard: boolean;
  currentSkillUsers: any = null;
  private refreshSubscription!: Subscription;

  filterSections: FilterSection[] = [
    {
      title: 'Level',
      expanded: true,
      options: [
        { label: 'Beginner', value: 'Beginner' },
        { label: 'Average', value: 'Average' },
        { label: 'Advanced', value: 'Advanced' },
      ],
      selectedOptions: [],
    },
    {
      title: 'Status',
      expanded: true,
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
      selectedOptions: [],
    },];
  skillSummaryData: SkillSummaryData = {
    allSkills: 25,
    activeSkills: 10,
    questionSolved: 10,
    timeSpent: 10,
  };
  domainId: number;

  constructor(private learningOutcomesService: LearningOutcomesService, private route: ActivatedRoute, private headerService: HeaderService, private sharedService : SharedService) { }

  ngOnInit(): void {
    this.refreshSubscription = this.sharedService.refresh$.subscribe(() => {
      this.route.paramMap.subscribe(params => {
        this.domainId = parseInt(params.get('domainId'));
        this.curriculumId = parseInt(params.get('curriculumId'));
        console.log('Domain ID:', this.domainId, 'Curriculum ID:', this.curriculumId);
        this.getSkills();
      });
    });
  }

  getSkills() {
    this.learningOutcomesService.lessonsCurriculumsSkills(this.headerService.selectedSectionId, this.domainId ? this.domainId : null, this.curriculumId ? this.curriculumId : null).subscribe(res => {
      if (res.success) {
        this.lessons = res.result;
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

interface FilterOption {
  label: string;
  value: string;
}