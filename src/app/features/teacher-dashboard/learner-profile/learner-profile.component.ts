import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LearnerOverviewComponent } from './learner-overview/learner-overview.component';
import { LearnerSkillsComponent } from './learner-skills/learner-skills.component';
import { LearnerLeveledReadingComponent } from './learner-leveled-reading/learner-leveled-reading.component';
import { LearnerAssignmentsComponent } from './learner-assignments/learner-assignments.component';
import { LearnerExamsComponent } from './learner-exams/learner-exams.component';

@Component({
  selector: 'app-learner-profile',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TranslateModule,
    LearnerOverviewComponent,
    LearnerSkillsComponent,
    LearnerLeveledReadingComponent,
    LearnerAssignmentsComponent,
    LearnerExamsComponent
  ],
  templateUrl: './learner-profile.component.html',
  styleUrl: './learner-profile.component.scss'
})
export class LearnerProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  selectedTab: string = 'overview';
  learnerName: string = '';
  learnerId: string | null = null;

  ngOnInit(): void {
    // Get learner ID from route params
    this.learnerId = this.route.snapshot.paramMap.get('id');
    
    // Get learner name from query params or use a default
    this.learnerName = this.route.snapshot.queryParamMap.get('name') || 'Student Name';
  }

  onTabClick(tab: string): void {
    this.selectedTab = tab;
  }

  onEditInformation(): void {
    console.log('Edit Information clicked for learner:', this.learnerId);
    // TODO: Implement edit information functionality
  }

  onSendAssignment(): void {
    console.log('Send Assignment clicked for learner:', this.learnerId);
    // TODO: Implement send assignment functionality
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  }
}
