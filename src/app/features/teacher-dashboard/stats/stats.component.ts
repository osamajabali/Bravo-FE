import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartOptions } from 'chart.js';
import { DoughnutChartDirective } from '../../../shared/functions/directives/doughnut-chart.directive';
import { StatsService } from '../../../core/services/teacher-dashboard-services/stats.service';
import { Stats, StatsRequest } from '../../../core/models/teacher-dashboard-models/stats.model';
import { HeaderService } from '../../../core/services/header-services/header.service';
import { SkeletonComponent } from "../../../shared/components/skeleton/skeleton.component";
import { SharedService } from '../../../core/services/shared-services/shared.service';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [CommonModule, DoughnutChartDirective, SkeletonComponent],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {

  stats : Stats[] = []

  skills = [
    { name: 'Reading', inactive: 30, activated: 70 },
      { name: 'Grammar', inactive: 50, activated: 50 },
      { name: 'Spelling', inactive: 70, activated: 30 },
      { name: 'Writing', inactive: 100, activated: 0 },
  ]
  
  masteredSkillsPieChartData: number[] = []; // Update to an array of numbers for pie chart
  pieChartLabels: string[] = ['Activated', 'Inactive'];

  chartOptions: ChartOptions = {
    maintainAspectRatio: false, // Allows you to manage the aspect ratio directly in CSS
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}%`,
        },
      },
    },
  };

  constructor(private statsService: StatsService , private headerService : HeaderService , private sharedService : SharedService) { }

  ngOnInit() {
    this.sharedService.apiResponse$.subscribe((data) => {
      if (data) {
        this.getStats();
      } else {
        console.warn('apiResponse$ is null or undefined');
      }
    });
  }
  

  getStats() {
    let model : StatsRequest ={
      sectionId : this.headerService.selectedSectionId,
      subjectId: this.headerService.selectedSubjectId
    };
    this.statsService.getStats(model).subscribe(res =>{
      if(res.success){
        this.stats = res.result.learningOutcomesStats
      }
    })
  }


  onSelect =(event: any) : void => {
    console.log('Item clicked', event);
  }
}
