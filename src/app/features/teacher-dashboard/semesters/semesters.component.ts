import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardComponent } from "../../../shared/components/dashboard/dashboard.component";
import { HeaderService } from '../../../core/services/header-services/header.service';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { StatsService } from '../../../core/services/teacher-dashboard-services/stats.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Stats, StatsRequest } from '../../../core/models/teacher-dashboard-models/stats.model';
import { Semester } from '../../../core/models/teacher-dashboard-models/semesters.model';
import { Skills } from '../../../core/models/teacher-dashboard-models/main-skills.model';

@Component({
  selector: 'app-semesters',
  imports: [DashboardComponent],
  templateUrl: './semesters.component.html',
  styleUrls: ['./semesters.component.scss']  // Fixed typo here (should be styleUrls)
})
export class SemestersComponent implements OnInit, OnDestroy {

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
    this.sharedService.removeArray();
    if (localStorage.getItem('selectedItems')) {
      this.getStats();
      this.getClasses();
    }
    let check = this.sharedService.getSelectedItems()?.selectedGradeId == null;
    this.refreshSubscription = this.sharedService.refresh$.subscribe(res => {
      if ((res == 'trigger' && check) || res == 'refresh') {
        this.getStats();
        this.getClasses();
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribing to avoid memory leaks
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  getClasses() {

    this.statsService.getSemesters(this.sharedService.getSelectedItems().selectedSectionId).subscribe((res) => {
      if (res) {
        if (res.result == null) {
          this.skills = [];
        } else {
          this.skills = res.result;
        }
      }
    });
  }

  getStats() {
    let model: StatsRequest = {
      courseSectionId: this.headerService.selectedSectionId,
      subjectId: this.headerService.selectedSubjectId,
    };
    this.statsService.getStats(model).subscribe((res) => {
      if (res.success) {
        this.stats = res.result.learningOutcomesStats;
      }
    });
  }

  goToSingleSkill(semester: Skills | Semester) {
    let selectedSemester = semester as Semester;
    this.sharedService.pushTitle(selectedSemester.name)
    this.sharedService.saveId('semesterId', selectedSemester.semesterId);
    sessionStorage.removeItem('UnitsComponent');
    this.router.navigate(['/features/semesters/units']);
  }

}
