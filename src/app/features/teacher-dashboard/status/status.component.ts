import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsService, Stats } from './service/stats.service';
import { ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DoughnutChartDirective } from '../../../shared/directives/doughnut-chart.directive';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, DoughnutChartDirective],
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
})
export class StatusComponent implements OnInit {
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

  constructor(private statsService: StatsService) {}

  ngOnInit() {
    this.stats = this.statsService.getStats();

    // Populate pie chart data
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

  onSelect(event: any) {
    console.log('Item clicked', event);
  }
}
