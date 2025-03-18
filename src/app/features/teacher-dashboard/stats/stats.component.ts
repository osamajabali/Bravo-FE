import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardComponent } from "../../../shared/components/dashboard/dashboard.component";
import { HeaderService } from '../../../core/services/header-services/header.service';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { StatsService } from '../../../core/services/teacher-dashboard-services/stats.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Stats, StatsRequest } from '../../../core/models/teacher-dashboard-models/stats.model';
import { Skills } from '../../../core/models/teacher-dashboard-models/main-skills.model';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [DashboardComponent],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit, OnDestroy {

  private refreshSubscription!: Subscription;
  skills: Skills[] = [];
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

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  getClasses() {
    let model: StatsRequest = {
      sectionId: this.headerService.selectedSectionId,
      subjectId: this.headerService.selectedSubjectId,
    };

    this.statsService.getMainSkills(model).subscribe((res) => {
      if (res) {
        this.skills = res.result.domains;
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

  goToSingleSkill(domainId: number) {
    if (this.router.url.includes('units')) {
      this.router.navigate(['/features/units']);
    } else {
      this.router.navigate(['/features/skills-level-one', domainId]);
    }
  }
}
