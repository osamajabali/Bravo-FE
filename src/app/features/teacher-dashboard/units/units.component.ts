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
import { SkillsStatisticsService } from '../../../core/services/skills/skills-statistics.service';
import { Statistics, StatisticsResponse } from '../../../core/models/teacher-dashboard-models/statistics.model';
import { StatisticsEnum } from '../../../core/models/shared-models/enums';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { SkeletonComponent } from "../../../shared/components/skeleton/skeleton.component";

@Component({
  selector: 'app-units',
  standalone: true,
  imports: [
    CommonModule,
    UnitCardsComponent,
    TranslateModule,
    SkillSummaryComponent,
    PaginationComponent,
    SkeletonComponent
  ],
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss'], // Corrected styleUrl to styleUrls (plural)
})
export class UnitsComponent implements OnInit, OnDestroy {
  private refreshSubscription!: Subscription; // Mark subscription as private to avoid accidental changes
  unitsPagination: UnitsPagination = new UnitsPagination();
  semesterId: number;
  unitPayload: UnitPayload = new UnitPayload();
  first: number = 0;
  statistics: StatisticsResponse[] = [];

  constructor(
    private headerService: HeaderService,
    private learningOutcomesService: LearningOutcomesService,
    public sharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router,
    private statisticsService: SkillsStatisticsService
  ) { }

  ngOnInit(): void {
    this.semesterId = this.sharedService.getId('semesterId'); // Using '!' to assert non-null value
    if (localStorage.getItem('selectedItems')) {
      this.getUnits();
      this.getStatistics()
    }
    let check = this.sharedService.getSelectedItems()?.selectedGradeId == 0;
    this.refreshSubscription = this.sharedService.refresh$.subscribe(res => {
      if (((res == 'trigger') && check) || res == 'refresh') {
        this.getUnits();
        this.getStatistics()
      }
    });
  }

  getStatistics() {
    let model: Statistics = {
      courseSectionId: this.sharedService.getSelectedItems().selectedSectionId,
      type: StatisticsEnum.Semester,
      id: this.semesterId
    }
    this.statisticsService.getStatistics(model).subscribe(res => {
      if (res.success) {
        this.statistics = res.result
      }
    })
  }


  onSearchChange($event: string) {
    this.unitPayload.searchValue = $event;
    this.sharedService.savePageState('UnitsComponent', 1)
    this.getUnits();
  }

  getUnits() {
    if (this.sharedService.getPageState('UnitsComponent')) {
      let pageNumber = this.sharedService.getPageState('UnitsComponent');
      this.unitPayload.pageNumber = pageNumber;
      this.first = (pageNumber - 1) * this.unitsPagination.pageSize;
    }
    this.unitPayload.courseSectionId = this.sharedService.getSelectedItems().selectedSectionId;
    this.unitPayload.semesterId = this.semesterId;

    this.learningOutcomesService.getUnits(this.unitPayload).subscribe((res) => {
      if (res.success) {
        this.unitsPagination = res.result;
      }
    });
  }

  nextPage($event: PaginatorState) {
    this.unitPayload.pageNumber = $event.page;
    this.sharedService.savePageState('UnitsComponent', $event.page)
    this.first = $event.first;
    this.getUnits();
  }

  cardClick(card: any) {
    this.sharedService.pushTitle((card as Unit).unitName);
    this.sharedService.saveId('unitId', (card as Unit).unitId)
    sessionStorage.removeItem('LessonsComponent');
    this.router.navigate(['/features/semesters/lessons']);
  }

  ngOnDestroy(): void {
    // Unsubscribing from any active subscriptions
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
}
