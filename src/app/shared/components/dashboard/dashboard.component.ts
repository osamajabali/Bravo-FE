import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { DoughnutChartDirective } from '../../functions/directives/doughnut-chart.directive';
import { SkeletonComponent } from '../skeleton/skeleton.component';
import { Skills } from '../../../core/models/teacher-dashboard-models/main-skills.model';
import { Stats } from '../../../core/models/teacher-dashboard-models/stats.model';
import { QuickSkill, Semester } from '../../../core/models/teacher-dashboard-models/semesters.model';
import { SkillActivationModalComponent } from "../skill-activation-modal/skill-activation-modal.component";
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HeaderService } from '../../../core/services/header-services/header.service';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { Section } from '../../../core/models/header-models/header.model';
import { SkillActivation } from '../../../core/models/teacher-dashboard-models/skillsActivation.model';
import { SkillActivationService } from '../../../core/services/skills/skill-activation.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    DoughnutChartDirective,
    SkeletonComponent,
    ButtonModule,
    CardModule,
    TranslateModule,
    SkillActivationModalComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  @Input() stats: Stats[] = [];
  @Input() title: string;
  @Input() isSemester: boolean = false;
  @Input() items: (Skills | Semester)[] = [];
  @Output() action = new EventEmitter<Skills | Semester>();

  pieChartLabels: string[] = ['Activated', 'Inactive'];
  activateSkill: boolean;
  skillActivationModel: SkillActivation = new SkillActivation();

  private refreshSubscription!: Subscription; // Mark subscription as private to avoid accidental changes
  sections: Section[] = [];
  selectedItem: Skills | Semester;
  selectedQuickSkill: QuickSkill = new QuickSkill();
  skipThisSkill: boolean;

  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private headerService: HeaderService,
    private skillActivationService: SkillActivationService
  ) { }

  ngOnInit(): void {
    this.refreshSubscription = this.sharedService.refresh$.subscribe((res) => {
      if (res) {
        this.route.paramMap.subscribe((params) => {
          this.sections = this.headerService.sectionsArray;
        });
      }
    });
  }

  isSkill(item: Skills | Semester): item is Skills {
    return (item as Skills).domainId !== undefined;
  }

  _activateSkill(sectionsArray: number[]) {
    this.activateSkill = false;
    this.skillActivationModel.domainId = this.isSkill(this.selectedItem) ? this.selectedItem.domainId : 0;
    this.skillActivationModel.semesterId = this.isSkill(this.selectedItem) ? 0 : this.selectedItem.semesterId;
    this.skillActivationModel.currentCourseSectionId = this.headerService.selectedSectionId;
    this.skillActivationModel.courseSectionIdList = sectionsArray;
    this.skillActivationModel.learningOutcomeId = this.selectedQuickSkill.learningOutcomeId;
    this.skillActivationModel.activationStatus = false;
    this.skillActivationService.quickActionActivation(this.skillActivationModel).subscribe(res => {
      if (res.success) {
        this.changeQuickSkills(res.result)
      }
    })
  }

  skipSkill(quickAction : QuickSkill , item: (Skills | Semester)) {
    this.activateSkill = false;
    this.selectedQuickSkill = quickAction;
    this.selectedItem = item;
    this.skillActivationModel = new SkillActivation();
    this.skillActivationModel.domainId = this.isSkill(this.selectedItem) ? this.selectedItem.domainId : 0;
    this.skillActivationModel.semesterId = this.isSkill(this.selectedItem) ? 0 : this.selectedItem.semesterId;
    this.skillActivationModel.currentCourseSectionId = this.headerService.selectedSectionId;
    
    this.skillActivationModel.learningOutcomeId = this.selectedQuickSkill.learningOutcomeId;
    this.skillActivationService.skipSkill(this.skillActivationModel).subscribe(res => {
      if (res.success) {
        this.changeQuickSkills(res.result)
      }
    })
  }

  changeQuickSkills(item: QuickSkill) {
    const index = this.selectedItem.quickSkills.findIndex(arr => arr.learningOutcomeId === this.selectedQuickSkill.learningOutcomeId);
    if (index !== -1) {
      // Replace the item at the found index with the new item
      this.selectedItem.quickSkills[index] = item;
    } else {
      // If the item to replace wasn't found, just add the new item
      this.selectedItem.quickSkills.push(item);
    }
  }
  

  showActivationModal(item: (Skills | Semester), selectedQuickSkill: QuickSkill) {
    this.selectedItem = item;
    this.selectedQuickSkill = selectedQuickSkill
    this.activateSkill = true;
  }

  goToSingleSkill(item: Skills | Semester) {
    this.action.emit(item);
  }
}
