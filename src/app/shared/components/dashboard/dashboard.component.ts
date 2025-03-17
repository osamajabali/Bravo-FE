import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { DoughnutChartDirective } from '../../functions/directives/doughnut-chart.directive';
import { SkeletonComponent } from '../skeleton/skeleton.component';
import { Skills } from '../../../core/models/teacher-dashboard-models/main-skills.model';
import { Stats } from '../../../core/models/teacher-dashboard-models/stats.model';
import { Semester } from '../../../core/models/teacher-dashboard-models/semesters.model';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    DoughnutChartDirective,
    SkeletonComponent,
    ButtonModule,
    CardModule,
    TranslateModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  @Input() stats: Stats[] = [];
  @Input() title: string;
  @Input() items: (Skills | Semester)[] = [];
  @Output() action = new EventEmitter<number>();

  pieChartLabels: string[] = ['Activated', 'Inactive'];

  constructor() {}

  ngOnInit() {}

  isSkill(item: Skills | Semester): item is Skills {
    return (item as Skills).domainId !== undefined;
  }

  goToSingleSkill(domainId: number) {
    this.action.emit(domainId);
  }
}
