import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { 
  questionsChartData, 
  timeChartData, 
  readingTimeChartData,
  readingPieChartData,
  assignmentsChartData,
  createQuestionsChartConfig, 
  createTimeChartConfig,
  createReadingTimeChartConfig,
  createReadingPieChartConfig,
  createAssignmentsChartConfig,
  ChartData 
} from './chart-configs';

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

interface ModuleOption {
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

  moduleOptions: ModuleOption[] = [
    { label: 'Learning', value: 'learning' },
    { label: 'Assessment', value: 'assessment' },
    { label: 'Practice', value: 'practice' }
  ];

  selectedModule: ModuleOption = this.moduleOptions[0]; // Default to Learning

  // Chart data imported from chart-configs.ts
  questionsData: ChartData = questionsChartData;
  timeData: ChartData = timeChartData;
  readingTimeData: ChartData = readingTimeChartData;
  readingPieData: ChartData = readingPieChartData;
  assignmentsData: ChartData = assignmentsChartData;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      Chart.register(...registerables);
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.renderChartsForCurrentTab();
      }, 100);
    }
  }

  private createQuestionsChart(): void {
    if (this.questionsChartInstance) {
      this.questionsChartInstance.destroy();
    }
    
    if (!this.questionsChart?.nativeElement) return;

    const ctx = this.questionsChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const config = createQuestionsChartConfig(this.questionsData);
    this.questionsChartInstance = new Chart(ctx, config);
  }

  private createTimeChart(): void {
    if (this.timeChartInstance) {
      this.timeChartInstance.destroy();
    }
    
    if (!this.timeChart?.nativeElement) return;

    const ctx = this.timeChart.nativeElement.getContext('2d');
    if (!ctx) return;

    // Create gradient for School Avg line
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(59, 143, 167, 0.2)');
    gradient.addColorStop(1, 'rgba(59, 143, 167, 0)');

    // Apply gradient to the School Avg dataset
    const chartData = { ...this.timeData };
    (chartData.datasets[0] as any).backgroundColor = gradient;

    const config = createTimeChartConfig(chartData);
    this.timeChartInstance = new Chart(ctx, config);
  }

  private createReadingTimeChart(): void {
    if (this.timeChartInstance) {
      this.timeChartInstance.destroy();
    }
    
    if (!this.timeChart?.nativeElement) return;

    const ctx = this.timeChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const config = createReadingTimeChartConfig(this.readingTimeData);
    this.timeChartInstance = new Chart(ctx, config);
  }

  private createReadingPieChart(): void {
    if (this.questionsChartInstance) {
      this.questionsChartInstance.destroy();
    }
    
    if (!this.questionsChart?.nativeElement) return;

    const ctx = this.questionsChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const config = createReadingPieChartConfig(this.readingPieData);
    this.questionsChartInstance = new Chart(ctx, config);
  }

  private createAssignmentsChart(): void {
    if (this.questionsChartInstance) {
      this.questionsChartInstance.destroy();
    }
    
    if (!this.questionsChart?.nativeElement) return;

    const ctx = this.questionsChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const config = createAssignmentsChartConfig(this.assignmentsData);
    this.questionsChartInstance = new Chart(ctx, config);
  }

  private renderChartsForCurrentTab(): void {
    // Destroy existing charts
    if (this.questionsChartInstance) {
      this.questionsChartInstance.destroy();
      this.questionsChartInstance = undefined;
    }
    if (this.timeChartInstance) {
      this.timeChartInstance.destroy();
      this.timeChartInstance = undefined;
    }

    // Render charts based on selected tab
    if (this.selectedTab === '1') {
      // Learning Outcomes tab
      this.createQuestionsChart();
      this.createTimeChart();
    } else if (this.selectedTab === '2') {
      // Reading Comprehension tab
      this.createReadingPieChart();
      this.createReadingTimeChart();
    } else if (this.selectedTab === '3') {
      // Assignments tab
      this.createAssignmentsChart();
      // No second chart for assignments tab
    }
    // Add more tabs as needed
  }

  onTabClick(tab: string) {
    this.selectedTab = tab;
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.renderChartsForCurrentTab();
      }, 100);
    }
  }

  onTimePeriodChange(event: any) {
    this.selectedTimePeriod = event.value;
    this.updateChartData();
  }

  onModuleChange(event: any) {
    this.selectedModule = event.value;
    this.updateChartData();
  }

  private updateChartData() {
    if (this.questionsChartInstance) {
      this.questionsChartInstance.update();
    }
    if (this.timeChartInstance) {
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