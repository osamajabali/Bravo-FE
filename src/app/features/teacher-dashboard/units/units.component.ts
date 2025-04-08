import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Unit, UnitPayload, UnitsPagination } from '../../../core/models/teacher-dashboard-models/units.model';
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
import { ActivatedRoute, Router } from '@angular/router';
import { PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-units',
  imports: [
    CommonModule,
    UnitCardsComponent,
    TranslateModule,
    SkillSummaryComponent,
  ],
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss'], // Corrected styleUrl to styleUrls (plural)
})
export class UnitsComponent implements OnInit, OnDestroy {
  private refreshSubscription!: Subscription; // Mark subscription as private to avoid accidental changes
  unitsPagination: UnitsPagination = new UnitsPagination();
  summaryData: SkillSummaryData = {
    allSkills: 0,
    activeSkills: 0,
    questionSolved: 0,
    timeSpent: 0,
  };
  semesterId: number;
  unitPayload: UnitPayload = new UnitPayload();
  first: number = 0;

  constructor(
    private headerService: HeaderService,
    private learningOutcomesService: LearningOutcomesService,
    public sharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    if (!this.sharedService) {
      this.sharedService = new SharedService();
    }
  }

  ngOnInit(): void {
    // Subscribing to the refresh event
    this.refreshSubscription = this.sharedService.refresh$.subscribe((res) => {
      if (res) {
        this.route.paramMap.subscribe((params) => {
          this.semesterId = parseInt(params.get('semesterId')!); // Using '!' to assert non-null value
          this.getUnits();
        });
      }
    });

    // If section ID is available, fetch units immediately
    if (this.headerService.selectedSectionId) {
      this.getUnits();
    }
  }

  getUnits() {
    if(this.sharedService.getPageState('UnitsComponent')){
      let  pageNumber = this.sharedService.getPageState('UnitsComponent');
      this.unitPayload.pageNumber = pageNumber;
      this.first = (pageNumber - 1) * this.unitsPagination.pageSize;
    }
    this.unitPayload.courseSectionId = this.headerService.selectedSectionId;
    this.unitPayload.semesterId = this.semesterId;

    this.learningOutcomesService.getUnits(this.unitPayload).subscribe((res) => {
      if (res.success) {
        this.unitsPagination = res.result;
      }
    });
  }

  nextPage($event: PaginatorState) {
    this.unitPayload.pageNumber = $event.page;
    this.sharedService.savePageState('UnitsComponent' , $event.page)
    this.first = $event.first;
    this.getUnits();
  }

  cardClick(card : any) {
    this.sharedService.pushTitle((card as Unit).unitLabelName + ' - ' +this.sharedService.translate('LESSONS'))
    this.router.navigate(['/features/semesters/lessons', (card as Unit).unitId]);
  }

  ngOnDestroy(): void {
    // Unsubscribing from any active subscriptions
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
}
