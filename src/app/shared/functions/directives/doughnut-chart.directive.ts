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
    @Inject(PLATFORM_ID) private platformId: Object // Inject platform check
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
              const dataset = chart.data.datasets[0];
              const total = dataset.data.reduce((acc, value) => acc + value, 0);
              const activeSkills = dataset.data[0]; // Adjust based on index if needed
              const text =
                total > 0 ? `${Math.round((activeSkills / total) * 100)}%` : '';

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
            data: this.data,
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
                const labels = chart.data.labels;
                const dataValues = chart.data.datasets[0].data;
                const backgroundColors = chart.data.datasets[0].backgroundColor;

                return labels.map((label, index) => {
                  const text = label as string;
                  const count = dataValues[index];
                  const color = text === 'Activated' ? '#704B1D' : '#171717';
                  const legendColor = backgroundColors[index] || '#171717';
                  return {
                    text: `${count} ${text}`,
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
