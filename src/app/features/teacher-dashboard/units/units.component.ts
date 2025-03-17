import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Unit, UnitPayload } from '../../../core/models/teacher-dashboard-models/units.model';
import { Subscription } from 'rxjs';
import { HeaderService } from '../../../core/services/header-services/header.service';
import { UnitCardsComponent } from '../../../shared/components/unit-cards/unit-cards.component';
import { LearningOutcomesService } from '../../../core/services/teacher-dashboard-services/learning-outcomes.service';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { TranslateModule } from '@ngx-translate/core';
import {
  SkillSummaryComponent,
  SkillSummaryData,
} from '../../../shared/components/skill-summary/skill-summary.component';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-units',
  imports: [
    CommonModule,
    UnitCardsComponent,
    TranslateModule,
    SkillSummaryComponent,
  ],
  templateUrl: './units.component.html',
  styleUrl: './units.component.scss',
})
export class UnitsComponent implements OnInit, OnDestroy {
  refreshSubscription!: Subscription;

  units: Unit[] = [];
  summaryData: SkillSummaryData = {
    allSkills: 0,
    activeSkills: 0,
    questionSolved: 0,
    timeSpent: 0,
  };
  semesterId: number;
  unitPayload : UnitPayload = new UnitPayload();

  constructor(
    private headerService: HeaderService,
    private learningOutcomesService: LearningOutcomesService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
  ) {
    if (!this.sharedService) {
      this.sharedService = new SharedService();
    }
  }

  ngOnInit(): void {
    
    this.refreshSubscription = this.sharedService.refresh$.subscribe((res) => {
      if (res) {
        this.route.paramMap.subscribe((params) => {
          this.semesterId = parseInt(params.get('semesterId'));
          this.getUnits();
        });
      }
    });

    if (this.headerService.selectedSectionId) {
      this.getUnits();
    }
  }

  getUnits() {
      this.unitPayload.courseSectionId = this.headerService.selectedSectionId,
      this.unitPayload.semesterId = this.semesterId

    this.learningOutcomesService.getUnits(this.unitPayload).subscribe((res) => {
      if (res.success) {
        this.units = res.result.units;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
}
