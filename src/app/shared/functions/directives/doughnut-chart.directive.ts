import {
  Directive,
  Input,
  ElementRef,
  OnChanges,
  SimpleChanges,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { Chart, LegendItem, registerables } from 'chart.js';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appDoughnutChart]',
})
export class DoughnutChartDirective implements OnChanges {
  @Input() data: number[] = [];
  @Input() labels: string[] = [];
  @Input() isSkills: boolean = true;

  private chart: Chart | undefined;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object // Platform check for SSR
  ) {
    if (isPlatformBrowser(this.platformId)) {
      Chart.register(...registerables); // Register Chart.js only in the browser
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      isPlatformBrowser(this.platformId) &&
      (changes['data'] || changes['labels'])
    ) {
      this.renderChart();
    }
  }

  private renderChart(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Prevent execution on the server
    }

    const ctx = this.el.nativeElement.getContext('2d');

    if (this.chart) {
      this.chart.destroy();
    }

    let chartData: number[];

    if (this.data.length === 1) {
      // If a single percentage value is passed, assume it's the active portion
      const percentage = this.data[0];
      chartData = [percentage, 100 - percentage]; // Ensure total is 100
    } else {
      // Normalize multiple values to ensure they sum to 100
      const totalValue = this.data.reduce((sum, value) => sum + value, 0);
      chartData = totalValue > 0 ? this.data.map(value => (value / totalValue) * 100) : [100];
    }

    const backgroundColor = this.isSkills
      ? ['#54C8E8', '#FFFF']
      : ['#54C8E8', '#C9C9C9'];

    const plugins = !this.isSkills
      ? []
      : [
          {
            id: 'centerText',
            afterDraw: (chart) => {
              const ctx = chart.ctx;
              const percentage = chart.data.datasets[0].data[0] as number; // First item as percentage
              const text = percentage ? `${Math.round(percentage)}%` : '0%';

              // Set font properties
              ctx.save();
              ctx.font = 'bold 16px Arial';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = '#1B4D5B'; // Text color
              const centerX = chart.width / 2.3;
              const centerY = chart.height / 2;

              // Draw text
              ctx.fillText(text, centerX, centerY);
              ctx.restore();
            },
          },
        ];

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.data.length > 0 ? this.labels : ['No Data'],
        datasets: [
          {
            data: chartData, // Use processed percentage data
            backgroundColor: backgroundColor,
            hoverBackgroundColor: backgroundColor,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: this.isSkills ? '65%' : '45%',
        plugins: {
          legend: {
            display: true,
            position: 'right',
            align: 'center',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              boxHeight: 14,
              boxWidth: 14,
              font: {
                size: 14,
                weight: 'bold',
              },
              padding: 10,
              generateLabels: (chart) => {
                const labels = chart.data.labels as string[];
                const dataValues = chart.data.datasets[0].data as number[];
                const backgroundColors = chart.data.datasets[0].backgroundColor as string[];

                return labels.map((label, index) => {
                  const count = Math.round(dataValues[index]); // Ensure percentage display
                  const color = label === 'Activated' ? '#704B1D' : '#171717';
                  const legendColor = backgroundColors[index] || '#171717';
                  return {
                    text: `${count}% ${label}`,
                    fontColor: color,
                    fillStyle: legendColor,
                    hidden: false,
                    index,
                    lineWidth: 0,
                  } as LegendItem;
                });
              },
            },
            onClick: () => {},
          },
          tooltip: {
            enabled: this.isSkills ? false : true,
          },
        },
      },
      plugins: plugins,
    });
  }
}
