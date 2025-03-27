import {
  Directive,
  Input,
  ElementRef,
  OnChanges,
  SimpleChanges,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { Chart, Plugin, registerables, ChartOptions } from 'chart.js';
import { isPlatformBrowser } from '@angular/common';

// ✅ Center Percentage Text Plugin
const CenterTextPlugin: Plugin = {
  id: 'centerText',
  afterDraw(chart) {
    const { ctx, chartArea } = chart;
    const dataset = chart.data.datasets[0];

    if (!dataset || dataset.data.length === 0) return;

    const percentage = dataset.data[0] as number;
    const text = `${Math.round(percentage)}%`;

    ctx.save();
    ctx.font = 'bold 14px Space Grotesk';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#1B4D5B';

    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;

    ctx.fillText(text, centerX, centerY);
    ctx.restore();
  },
};

@Directive({
  selector: '[appDoughnutChart]',
})
export class DoughnutChartDirective implements OnChanges {
  @Input() data: number[] = [];
  @Input() labels: string[] = [];
  @Input() color: string = '#54C8E8'; // ✅ Uses the same color as `AllSkillsComponent`
  @Input() isSkills: boolean = true; // ✅ Determines if it's a skill or stat chart
  @Input() activeCount: number = 0;
  @Input() inactiveCount: number = 0;

  private chart: Chart | undefined;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      Chart.register(...registerables);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      isPlatformBrowser(this.platformId) &&
      (changes['data'] || changes['labels'] || changes['color'])
    ) {
      this.renderChart();
    }
  }

  private renderChart(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const ctx = this.el.nativeElement.getContext('2d');

    if (this.chart) {
      this.chart.destroy();
    }

    let chartData: number[]; 
    const backgroundColor = ['#E0E0E0', this.color]; // ✅ Inactive on top (reversed order)

    if (this.data.length === 1) {
      const percentage = this.data[0];
      chartData = [100 - percentage, percentage]; // Inactive on top
    } else {
      const totalValue = this.data.reduce((sum, value) => sum + value, 0);
      chartData = totalValue > 0 ? 
        [((this.inactiveCount / totalValue) * 100), ((this.activeCount / totalValue) * 100)] : [100, 0]; // Inactive on top
    }

    // ✅ Explicitly type `options` to avoid `cutout` error
    const chartOptions: ChartOptions<'doughnut'> = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '75%', // ✅ Now TypeScript recognizes `cutout`
      plugins: {
        legend: {
          display: this.isSkills, // ✅ Legend only for skill charts
          position: 'right',
          onClick: () => {}, // ❌ Disable click behavior
          labels: {
            boxWidth: 12,
            padding: 15,
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          enabled: this.isSkills, // ✅ Tooltips only for skill charts
          callbacks: {
            label: function (context) {
              return `${context.label}: ${Math.round(context.raw as number)}%`;
            },
          },
        },
      },
    };

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.isSkills 
          ? [`${this.inactiveCount} Number of Inactive Skills`, `${this.activeCount} Number of Active Skills`] // Inactive on top
          : [], // Use active/inactive counts as labels
        datasets: [
          {
            data: chartData,
            backgroundColor: backgroundColor,
            borderWidth: 0,
          },
        ],
      },
      options: chartOptions,
      plugins: !this.isSkills ? [CenterTextPlugin] : [],
    });
  }
}
