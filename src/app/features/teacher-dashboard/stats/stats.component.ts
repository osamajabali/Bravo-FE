import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartOptions } from 'chart.js';
import { DoughnutChartDirective } from '../../../shared/functions/directives/doughnut-chart.directive';
import { StatsService } from '../../../core/services/teacher-dashboard-services/stats.service';
import { Stats } from '../../../core/models/teacher-dashboard-models/stats.model';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [CommonModule, DoughnutChartDirective],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {
  stats: Stats = {
    activeSkills: { completed: 0, unCompleted: 0 },
    totalSkills: { completed: 0, unCompleted: 0 },
    masteredSkills: { completed: 0, unCompleted: 0 },
    skills: [],
  };

  // Pie chart data
  activeSkillsPieChartData: number[] = []; // Update to an array of numbers for pie chart
  totalSkillsPieChartData: number[] = []; // Update to an array of numbers for pie chart
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

  constructor(private statsService: StatsService) { }

  ngOnInit() {
    this.stats = this.statsService.getStats();

    this.getChartData();
  }

  getChartData = () : void => {
    this.activeSkillsPieChartData = [
      this.stats.activeSkills.completed,
      this.stats.activeSkills.unCompleted,
    ];
    this.totalSkillsPieChartData = [
      this.stats.totalSkills.completed,
      this.stats.totalSkills.unCompleted,
    ];
    this.masteredSkillsPieChartData = [
      this.stats.masteredSkills.completed,
      this.stats.masteredSkills.unCompleted,
    ];
  }

  onSelect =(event: any) : void => {
    console.log('Item clicked', event);
  }
}
