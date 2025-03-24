import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PopoverModule } from 'primeng/popover';
import { Subscription, combineLatest } from 'rxjs';
import { SingleSkill } from '../../../core/models/teacher-dashboard-models/single-skill';
import { Level } from '../../../core/models/teacher-dashboard-models/students.model';
import { HeaderService } from '../../../core/services/header-services/header.service';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { SpinnerService } from '../../../core/services/shared-services/spinner.service';
import { LearningOutcomesService } from '../../../core/services/teacher-dashboard-services/learning-outcomes.service';
import { SkillActivationModalComponent } from '../skill-activation-modal/skill-activation-modal.component';
import { SkillSummaryComponent, SkillSummaryData } from '../skill-summary/skill-summary.component';
import { SmartBoardComponent } from '../smart-board/smart-board.component';
import { UserDrawerComponent } from '../user-drawer/user-drawer.component';
import { PaginationComponent } from "../pagination/pagination.component";
import { PaginatorState } from 'primeng/paginator';
import { SkillCurriculum } from '../../../core/models/teacher-dashboard-models/skill-curriculum.model';

@Component({
  selector: 'app-skills-cards',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    InputTextModule,
    PopoverModule,
    ButtonModule,
    DialogModule,
    UserDrawerComponent,
    SmartBoardComponent,
    SkillActivationModalComponent,
  ],
  templateUrl: './skills-cards.component.html',
  styleUrl: './skills-cards.component.scss'
})
export class SkillsCardsComponent {
  @Input() skill: SingleSkill | SkillCurriculum = {} as SingleSkill | SkillCurriculum;
  @Input() first: number = 0;
  @Input() rows: number = 0;
  @Input() totalRecords: number = 0;
  @Input() showPagination: boolean = false;
  @Output() paginatorState = new EventEmitter<PaginatorState>();
  activateSkill: boolean;
  showUserDrower: boolean;
  showSmartBoard: boolean;
  currentSkillUsers: any = null;
  private refreshSubscription!: Subscription;


  domainId: number;
  levels: Level[] = [];
  skillToActivate: SingleSkill | null | SkillCurriculum = null;

  constructor(
    private learningOutcomesService: LearningOutcomesService,
    private headerService: HeaderService,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    // Unsubscribe from any subscriptions to avoid memory leaks
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  onPageChange($event: PaginatorState) {
    this.paginatorState.emit($event)
    }

  toggleActive(skill: SingleSkill | SkillCurriculum) {
    this.skillToActivate = skill;
    this.activateSkill = !this.activateSkill;
  }

  _activateSkill() {
    this.activateSkill = !this.activateSkill;
    if (this.skillToActivate) {
      this.skillToActivate.isEnabled = !this.skillToActivate.isEnabled;
    }
  }

  getStudents = (lerningOutcomeId: number) => {
    this.spinnerService.show();
    this.learningOutcomesService
      .getStudents(this.headerService.selectedSectionId, lerningOutcomeId)
      .subscribe((res) => {
        if (res.success) {
          this.spinnerService.hide();
          this.showUserDrower = true;
          this.levels = res.result.students;
        }
      });
  };

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
