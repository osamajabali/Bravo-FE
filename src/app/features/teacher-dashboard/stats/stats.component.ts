import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardComponent } from "../../../shared/components/dashboard/dashboard.component";
import { HeaderService } from '../../../core/services/header-services/header.service';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { StatsService } from '../../../core/services/teacher-dashboard-services/stats.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Stats, StatsRequest } from '../../../core/models/teacher-dashboard-models/stats.model';
import { Skills } from '../../../core/models/teacher-dashboard-models/main-skills.model';
import { Semester } from '../../../core/models/teacher-dashboard-models/semesters.model';

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
    this.sharedService.removeArray();
    if (localStorage.getItem('selectedItems')) {
      this.getStats();
      this.getClasses();
    }
    let check = this.sharedService.getSelectedItems()?.selectedGradeId == null;
    this.refreshSubscription = this.sharedService.refresh$.subscribe(res => {
      if (((res == 'trigger') && check) || res == 'refresh') {
        this.getStats();
        this.getClasses();
      }
    });
    this.refreshSubscription = this.sharedService.refresh$.subscribe(() => {
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  getClasses() {
    let model: StatsRequest = {
      courseSectionId: this.sharedService.getSelectedItems().selectedSectionId,
      subjectId: this.sharedService.getSelectedItems().selectedSubjectId,
    };

    this.statsService.getMainSkills(model).subscribe((res) => {
      if (res) {
        this.skills = res.result;
      }
    });
  }

  getStats() {
    let model: StatsRequest = {
      courseSectionId: this.sharedService.getSelectedItems().selectedSectionId,
      subjectId: this.sharedService.getSelectedItems().selectedSubjectId,
    };
    this.statsService.getStats(model).subscribe((res) => {
      if (res.success) {
        this.stats = res.result.learningOutcomesStats;
      }
    });
  }

  goToSingleSkill(domain: Skills | Semester) {
    this.sharedService.pushTitle((domain as Skills).name);
    this.sharedService.saveId('skillDomainId', (domain as Skills).domainId);
    sessionStorage.removeItem('SkillLevelOneComponent');
    this.router.navigate(['/features/skills/skills-level-one']);
  }
}