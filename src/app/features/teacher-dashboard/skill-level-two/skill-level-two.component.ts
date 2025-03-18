import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SmartBoardComponent } from '../../../shared/components/smart-board/smart-board.component';
import { UserDrawerComponent } from '../../../shared/components/user-drawer/user-drawer.component';
import { FormsModule } from '@angular/forms';
import {
  SkillSummaryComponent,
  SkillSummaryData,
} from '../../../shared/components/skill-summary/skill-summary.component';
import { Subscription } from 'rxjs';
import { SingleSkill } from '../../../core/models/teacher-dashboard-models/single-skill';
import { Level } from '../../../core/models/teacher-dashboard-models/students.model';
import { SkillActivationModalComponent } from '../../../shared/components/skill-activation-modal/skill-activation-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { LessonCardsComponent } from '../../../shared/components/lesson-cards/lesson-cards.component';
import { SkillsCardsComponent } from '../../../shared/components/skills-cards/skills-cards.component';
import { DomainRequest } from '../../../core/models/teacher-dashboard-models/stats.model';
import { HeaderService } from '../../../core/services/header-services/header.service';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { StatsService } from '../../../core/services/teacher-dashboard-services/stats.service';

@Component({
  selector: 'app-skill-level-two',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    InputTextModule,
    OverlayPanelModule,
    ButtonModule,
    DialogModule,
    TranslateModule,
    SkillsCardsComponent,
    LessonCardsComponent
  ],
  templateUrl: './skill-level-two.component.html',
  styleUrl: './skill-level-two.component.scss',
})
export class SkillLevelTwoComponent {
   skills: SingleSkill[] = [];
   curriculumId: number | null = null;
   activateSkill: boolean = false;
   showUserDrower: boolean = false;
   showSmartBoard: boolean = false;
   currentSkillUsers: any = null;
   domainSkillsRequest: DomainRequest = new DomainRequest();
   private refreshSubscription!: Subscription;
 
   skillSummaryData: SkillSummaryData = {
     allSkills: 25,
     activeSkills: 10,
     questionSolved: 10,
     timeSpent: 10,
   };
   domainId: number = 1;
   levels: Level[] = [];
   skillToActivate: SingleSkill | null = null;
   router: Router = inject(Router);
   skillCurriculum: import("c:/Users/osama/Desktop/bravo-FE/src/app/core/models/teacher-dashboard-models/skill-curriculum.model").SkillCurriculum[];
   skillArray: any[] = [];
   curriculumArray: any[] = [];
 
   constructor(private statsService: StatsService, private headerService: HeaderService, private route: ActivatedRoute, private sharedService : SharedService) { }
 
   ngOnInit(): void {
     this.refreshSubscription = this.sharedService.refresh$.subscribe((res) => {
       if (res) {
         this.route.paramMap.subscribe((params) => {
           this.getSkills();           
         });
       }
     });
   }
 
   getSkills() {
     this.route.paramMap.subscribe(params => {
       this.domainId = parseInt(params.get('domainId') || '0');
       console.log('domainId:', this.domainId);
       this.domainSkillsRequest.domainId = this.domainId;
     });
     this.domainSkillsRequest.courseSectionId = this.headerService.selectedSectionId;
     this.statsService.getDomainSkills(this.domainSkillsRequest).subscribe(res => {
       if (res.success) {
         this.skillCurriculum = res.result.learningOutcomes;
         this.skillCurriculum.forEach(item => {
           if (item.isSkill) {
             this.skillArray.push(item); // Add to skillArray if isSkill is true
           } else {
             this.curriculumArray.push(item); // Add to curriculumArray if isSkill is false
           }
         })
       }
     })
   }
 }
 