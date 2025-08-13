import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

interface Summary {
  icon: string;
  desc: string;
  value: number | string;
}

interface Tab {
  title: string;
  id: string;
}

interface TimePeriodOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-quick-actions',
  imports: [CommonModule, TranslateModule, ButtonModule, DropdownModule, FormsModule],
  templateUrl: './quick-actions.component.html',
  styleUrl: './quick-actions.component.scss',
})
export class QuickActionsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('questionsChart', { static: false }) questionsChart?: ElementRef<HTMLCanvasElement>;
  @ViewChild('timeChart', { static: false }) timeChart?: ElementRef<HTMLCanvasElement>;
  private questionsChartInstance: Chart | undefined;
  private timeChartInstance: Chart | undefined;
  summary: Summary[] = [
    {
      icon: 'icon-dashboard-students.svg',
      desc: 'NO_OF_STUDENTS',
      value: 24,
    },
    {
      icon: 'icon-dashboard-questions.svg',
      desc: 'NO_OF_QS_SOLVED',
      value: 2345,
    },
    {
      icon: 'icon-dashboard-students.svg',
      desc: 'NO_OF_BOOKS_READ',
      value: 12,
    },
    {
      icon: 'icon-dashboard-skills.svg',
      desc: 'ACTIVATED_SKILLS',
      value: '12%',
    },
    {
      icon: 'icon-dashboard-questions.svg',
      desc: 'PROGRESSED_SKILLS',
      value: '24%',
    },
  ];

  tabs: Tab[] = [
    {
      title: 'LEARNING_OUTCOMES',
      id: '1',
    },
    {
      title: 'READING_COMPREHENSION',
      id: '2',
    },
    {
      title: 'ASSIGNMENTS',
      id: '3',
    },
    {
      title: 'EXAMS',
      id: '4',
    },
  ];

  selectedTab: string = this.tabs[0].id;

  timePeriodOptions: TimePeriodOption[] = [
    { label: 'LAST_7_DAYS', value: '7days' },
    { label: 'LAST_30_DAYS', value: '30days' },
    { label: 'LAST_3_MONTHS', value: '3months' },
    { label: 'LAST_6_MONTHS', value: '6months' },
    { label: 'LAST_YEAR', value: '1year' }
  ];

  selectedTimePeriod: TimePeriodOption = this.timePeriodOptions[1]; // Default to 30 days

  // Chart data for questions solved
  chartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    datasets: [
      {
        label: 'Wrong',
        data: [35, 28, 42, 25, 37], // Sample data for wrong answers
        backgroundColor: '#3b8fa7', // primary-700
        borderColor: '#3b8fa7',
        borderWidth: 0,
        borderRadius: {
          topLeft: 0,
          topRight: 0,
          bottomLeft: 8,
          bottomRight: 8
        },
        borderSkipped: false,
        stack: 'stack1',
        barThickness: 32
      },
      {
        label: 'Right',
        data: [85, 92, 78, 105, 88], // Sample data for correct answers
        backgroundColor: '#54c8e8', // primary-500
        borderColor: '#54c8e8',
        borderWidth: 0,
        borderRadius: {
          topLeft: 8,
          topRight: 8,
          bottomLeft: 0,
          bottomRight: 0
        },
        borderSkipped: false,
        stack: 'stack1',
        barThickness: 32
      }
    ]
  };

  // Chart data for time spent
  timeChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    datasets: [
      {
        label: 'School Avg',
        data: [2.5, 3.2, 2.8, 3.5, 3.0], // Sample data in hours
        borderColor: '#3B8FA7', // primary-700
        backgroundColor: '#3B8FA7', // Will be replaced with gradient
        borderWidth: 4,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 0,
        pointBackgroundColor: '#3B8FA7',
        pointBorderColor: '#3B8FA7'
      },
      {
        label: 'Class',
        data: [1.8, 2.5, 2.2, 5.8, 2.3], // Sample data in hours
        borderColor: '#54c8e8', // primary-500
        backgroundColor: '#54c8e8',
        borderWidth: 4,
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 0,
        pointBackgroundColor: '#54c8e8',
        pointBorderColor: '#54c8e8'
      }
    ]
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      Chart.register(...registerables);
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Simple single attempt with small delay to ensure canvas is ready
      setTimeout(() => {
        this.createQuestionsChart();
        this.createTimeChart();
      }, 100);
    }
  }

  private createQuestionsChart(): void {
    if (this.questionsChartInstance) {
      this.questionsChartInstance.destroy();
    }
    
    if (!this.questionsChart?.nativeElement) {
      console.error('Questions canvas element not found');
      return;
    }

    const ctx = this.questionsChart.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Could not get questions canvas context');
      return;
    }

    const config: ChartConfiguration = {
      type: 'bar',
      data: this.chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
            grid: {
              display: false
            },
            border: {
              display: false,
            },
            ticks: {
              font: {
                size: 12,
                family: 'Space Grotesk'
              },
              color: '#565656'
            }
          },
          y: {
            stacked: true,
            min: 0,
            max: 150,
            ticks: {
              stepSize: 25,
              font: {
                size: 12,
                family: 'Space Grotesk'
              },
              color: '#565656'
            },
            grid: {
              display: false
            },
            border: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            align: 'start',
            labels: {
              usePointStyle: true,
              pointStyle: 'rectRot',
              font: {
                size: 12,
                family: 'Space Grotesk',
              },
              color: '#3B8FA7',
              padding: 30,
              boxWidth: 12,
              boxHeight: 12,
              generateLabels: (chart) => {
                const datasets = chart.data.datasets;
                return datasets.map((dataset, i) => ({
                  text: dataset.label,
                  fillStyle: dataset.borderColor as string,
                  strokeStyle: dataset.borderColor as string,
                  lineWidth: 0,
                  pointStyle: 'circle',
                  radius: 6,
                  hidden: !chart.isDatasetVisible(i),
                  datasetIndex: i
                }));
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#54c8e8',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              title: (context) => {
                return context[0].label;
              },
              label: (context) => {
                return `${context.dataset.label}: ${context.parsed.y} questions`;
              }
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    };

    try {
      this.questionsChartInstance = new Chart(ctx, config);
      console.log('Questions chart created successfully');
    } catch (error) {
      console.error('Error creating questions chart:', error);
    }
  }

  private createTimeChart(): void {
    if (this.timeChartInstance) {
      this.timeChartInstance.destroy();
    }
    
    if (!this.timeChart?.nativeElement) {
      console.error('Time canvas element not found');
      return;
    }

    const ctx = this.timeChart.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Could not get time canvas context');
      return;
    }

    // Create gradient for School Avg line
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(59, 143, 167, 0.2)'); // primary-700 with 30% opacity at top
    gradient.addColorStop(1, 'rgba(59, 143, 167, 0)');   // primary-700 with 0% opacity at bottom

    // Apply gradient to the School Avg dataset
    const chartData = { ...this.timeChartData };
    (chartData.datasets[0] as any).backgroundColor = gradient;

    const config: ChartConfiguration = {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false
            },
            border: {
              display: false,
            },
            offset: true,
            ticks: {
              font: {
                size: 12,
                family: 'Space Grotesk'
              },
              color: '#565656',
            }
          },
          y: {
            min: 0,
            max: 6,
            ticks: {
              stepSize: 1,
              font: {
                size: 12,
                family: 'Space Grotesk'
              },
              color: '#565656',
              callback: function(value) {
                return value + ':00';
              }
            },
            grid: {
              display: false
            },
            border: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            align: 'start',
            labels: {
              usePointStyle: true,
              pointStyle: 'rectRot',
              font: {
                size: 12,
                family: 'Space Grotesk'
              },
              color: '#3B8FA7',
              padding: 30,
              boxWidth: 12,
              boxHeight: 12,
              generateLabels: (chart) => {
                const datasets = chart.data.datasets;
                return datasets.map((dataset, i) => ({
                  text: dataset.label,
                  fillStyle: dataset.borderColor as string,
                  strokeStyle: dataset.borderColor as string,
                  lineWidth: 0,
                  pointStyle: 'circle',
                  radius: 6,
                  hidden: !chart.isDatasetVisible(i),
                  datasetIndex: i
                }));
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#54c8e8',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              title: (context) => {
                return context[0].label;
              },
              label: (context) => {
                const hours = Math.floor(context.parsed.y);
                const minutes = Math.round((context.parsed.y - hours) * 60);
                const timeString = `${hours}:${minutes.toString().padStart(2, '0')}`;
                return `${context.dataset.label}: ${timeString}`;
              }
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    };

    try {
      this.timeChartInstance = new Chart(ctx, config);
      console.log('Time chart created successfully');
    } catch (error) {
      console.error('Error creating time chart:', error);
    }
  }

  onTabClick(tab: string) {
    this.selectedTab = tab;
    // Note: Chart should remain visible across tab changes
    // No need to recreate chart when switching tabs
  }

  onTimePeriodChange(event: any) {
    this.selectedTimePeriod = event.value;
    // Handle time period change logic here
    console.log('Time period changed to:', this.selectedTimePeriod);
    // You can update chart data based on the selected time period here
    this.updateChartData();
  }

  private updateChartData() {
    if (this.questionsChartInstance) {
      // Update questions chart data based on selected time period
      // This is where you would fetch new data from your service
      this.questionsChartInstance.update();
    }
    if (this.timeChartInstance) {
      // Update time chart data based on selected time period
      // This is where you would fetch new data from your service
      this.timeChartInstance.update();
    }
  }

  ngOnDestroy() {
    if (this.questionsChartInstance) {
      this.questionsChartInstance.destroy();
    }
    if (this.timeChartInstance) {
      this.timeChartInstance.destroy();
    }
  }
}

