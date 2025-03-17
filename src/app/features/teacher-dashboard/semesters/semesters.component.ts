import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardComponent } from "../../../shared/components/dashboard/dashboard.component";
import { HeaderService } from '../../../core/services/header-services/header.service';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { StatsService } from '../../../core/services/teacher-dashboard-services/stats.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Stats, StatsRequest } from 'c:/Users/osama/Desktop/bravo-FE/src/app/core/models/teacher-dashboard-models/stats.model';
import { Skills } from '../../../core/models/teacher-dashboard-models/main-skills.model';
import { Semester } from '../../../core/models/teacher-dashboard-models/semesters.model';

@Component({
  selector: 'app-semesters',
  imports: [DashboardComponent],
  templateUrl: './semesters.component.html',
  styleUrl: './semesters.component.scss'
})
export class SemestersComponent {

  private refreshSubscription!: Subscription;
  skills: Semester[] = [];
  stats: Stats[] = [];

  constructor(
    private statsService: StatsService,
    private headerService: HeaderService,
    private sharedService: SharedService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.refreshSubscription = this.sharedService.refresh$.subscribe(() => {
      this.getStats();
      this.getClasses();
    });
  }


  getClasses() {
    let model: StatsRequest = {
      sectionId: this.headerService.selectedSectionId,
      subjectId: this.headerService.selectedSubjectId,
    };

    this.statsService.getSemesters(this.headerService.selectedSectionId).subscribe((res) => {
      if (res) {
        this.skills = res.result;
      }
    });
  }

  getStats() {
    let model: StatsRequest = {
      sectionId: this.headerService.selectedSectionId,
      subjectId: this.headerService.selectedSubjectId,
    };
    this.statsService.getStats(model).subscribe((res) => {
      if (res.success) {
        this.stats = res.result.learningOutcomesStats;
      }
    });
  }

  goToSingleSkill(semesterId: number) {
    this.router.navigate(['/features/units', semesterId]);
  }

}
