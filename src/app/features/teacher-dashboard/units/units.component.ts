import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Unit } from '../../../core/models/teacher-dashboard-models/units.model';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { Subscription } from 'rxjs';
import { HeaderService } from '../../../core/services/header-services/header.service';
import { UnitCardsComponent } from "../../../shared/components/unit-cards/unit-cards.component";
import { LearningOutcomesService } from '../../../core/services/teacher-dashboard-services/learning-outcomes.service';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-units',
  imports: [CommonModule, UnitCardsComponent, TranslateModule],
  templateUrl: './units.component.html',
  styleUrl: './units.component.scss',
})
export class UnitsComponent implements OnInit, OnDestroy {

  refreshSubscription!: Subscription;

  units: Unit[] = [];

  constructor(
    private headerService: HeaderService,
    private learningOutcomesService: LearningOutcomesService,
    private sharedService: SharedService
  ) {
    if (!this.sharedService) {
      this.sharedService = new SharedService();
    }
  }

  ngOnInit(): void {
    this.refreshSubscription = this.sharedService.refresh$.subscribe(res => {
      if (res) {
        this.getUnits(this.headerService.selectedSectionId)
      }
    });

    if (this.headerService.selectedSectionId) {
      this.getUnits(this.headerService.selectedSectionId)
    }
  }

  getUnits(id: number) {
    this.learningOutcomesService.getUnits(id).subscribe(res => {
      if (res.success) {
        this.units = res.result.units
      }
    })
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
}
