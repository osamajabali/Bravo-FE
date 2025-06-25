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
import { TranslateService } from '@ngx-translate/core';

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
  @Input() trackColor: string = '#E0E0E0';
  @Input() isSkills: boolean = true; // ✅ Determines if it's a skill or stat chart
  @Input() showCenterText: boolean = true; // ✅ Controls whether to show center percentage text
  @Input() trackBorderWidth: number = 0; // ✅ Border width for the track (empty) portion
  @Input() trackBorderColor: string = '#CCCCCC'; // ✅ Border color for the track (empty) portion
  @Input() activeCount: number = 0;
  @Input() inactiveCount: number = 0;
  @Input() cutout: string = '75%';

  private chart: Chart | undefined;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private translate: TranslateService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      Chart.register(...registerables);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      isPlatformBrowser(this.platformId) &&
      (changes['data'] || changes['labels'] || changes['color'] || changes['activeCount'] || changes['inactiveCount'] || changes['showCenterText'] || changes['trackBorderWidth'] || changes['trackBorderColor'])
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

    // Fetch translations for Active and Inactive Skills labels
    this.translate.get(['ACTIVE_SKILLS', 'INACTIVE_SKILLS']).subscribe(translations => {
      const activeLabel = translations['ACTIVE_SKILLS'];
      const inactiveLabel = translations['INACTIVE_SKILLS'];

      let chartData: number[];
      const backgroundColor = [this.trackColor, this.color]; // Inactive on top (lighter color first)
      const borderColor = [this.trackBorderColor, this.color]; // Border colors
      const borderWidth = [this.trackBorderWidth, 0]; // Border widths - only for track

      if (this.data.length === 1) {
        const percentage = this.data[0];
        chartData = [100 - percentage, percentage]; // Inactive on top
      } else {
        const totalValue = this.data.reduce((sum, value) => sum + value, 0);
        chartData = totalValue > 0
          ? [
              (this.inactiveCount / totalValue) * 100,
              (this.activeCount / totalValue) * 100,
            ]
          : [100, 0]; // Inactive on top
      }

      const chartOptions: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: this.cutout,
        plugins: {
          legend: {
            display: this.isSkills,
            position: 'right',
            onClick: () => {},
            labels: {
              boxWidth: 10,
              padding: 5,
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            enabled: this.isSkills,
            callbacks: {
              label: function (context) {
                const label = context.label || '';
                if (!label.toLowerCase().includes(inactiveLabel.toLowerCase())) {
                  return `${Math.round(context.raw as number)}% ${activeLabel}`;
                } else {
                  return `${Math.round(context.raw as number)}% ${inactiveLabel}`;
                }
              },
              title: () => '', // Hide tooltip title
            },
          },
        },
      };

      this.chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: this.isSkills
            ? [`${this.inactiveCount} ${inactiveLabel}`, `${this.activeCount} ${activeLabel}`]
            : [],
          datasets: [
            {
              data: chartData,
              backgroundColor: backgroundColor,
              borderColor: borderColor,
              borderWidth: borderWidth,
            },
          ],
        },
        options: chartOptions,
        plugins: !this.isSkills && this.showCenterText ? [CenterTextPlugin] : [],
      });
    });
  }
}
