import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { DoughnutChartDirective } from '../../functions/directives/doughnut-chart.directive';
import { SkeletonComponent } from '../skeleton/skeleton.component';
import { ChartOptions } from 'chart.js';
import { Skills } from '../../../core/models/teacher-dashboard-models/main-skills.model';
import { Stats, StatsRequest } from '../../../core/models/teacher-dashboard-models/stats.model';
import { HeaderService } from '../../../core/services/header-services/header.service';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { StatsService } from '../../../core/services/teacher-dashboard-services/stats.service';
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
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  @Input() stats: Stats[] = [];
  @Input() title: string;
  @Input()  items: (Skills | Semester)[] = [];;
  @Output() action = new EventEmitter<number>();

  pieChartLabels: string[] = ['Activated', 'Inactive'];

  constructor() { }

  ngOnInit() {

  }

  isSkill(item: Skills | Semester): item is Skills {
    return (item as Skills).domainId !== undefined;
  }

  goToSingleSkill(domainId: number) {
    this.action.emit(domainId)
  }

}
