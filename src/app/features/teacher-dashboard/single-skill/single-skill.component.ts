import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LearningOutcomesService } from '../../../core/services/teacher-dashboard-services/learning-outcomes.service';
import { HeaderService } from '../../../core/services/header-services/header.service';
import { combineLatest, Subscription } from 'rxjs';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { SingleSkill } from '../../../core/models/teacher-dashboard-models/single-skill';
import { Level } from '../../../core/models/teacher-dashboard-models/students.model';
import { SpinnerService } from '../../../core/services/shared-services/spinner.service';
import { SkillsCardsComponent } from "../../../shared/components/skills-cards/skills-cards.component";

@Component({
  selector: 'app-single-skill',
  imports: [
    SkillsCardsComponent
],
  templateUrl: './single-skill.component.html',
  styleUrl: './single-skill.component.scss',
})
export class SingleSkillComponent implements OnInit, OnDestroy {
  skills: SingleSkill[] = [];
  curriculumId: number | null = null;
  activateSkill: boolean;
  showUserDrower: boolean;
  showSmartBoard: boolean;
  currentSkillUsers: any = null;
  private refreshSubscription!: Subscription;

  domainId: number;
  levels: Level[] = [];
  skillToActivate: SingleSkill | null = null;

  constructor(
    private learningOutcomesService: LearningOutcomesService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    // Subscribe to both paramMap and refresh$
    this.refreshSubscription = combineLatest([
      this.route.paramMap,
      this.sharedService.refresh$,
    ]).subscribe(([params]) => {
      this.domainId = parseInt(params.get('domainId') || '0');
      this.curriculumId = parseInt(params.get('curriculumId') || '0');
      this.getSkills();
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from any subscriptions to avoid memory leaks
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  getSkills() {
    this.learningOutcomesService
      .lessonsCurriculumsSkills(
        this.headerService.selectedSectionId,
        this.domainId ? this.domainId : 0,
        this.curriculumId ? this.curriculumId : 0
      )
      .subscribe((res) => {
        if (res.success) {
          this.skills = res.result.learningOutcomes;
        }
      });
  }
}
