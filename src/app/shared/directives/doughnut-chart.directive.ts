import {
  Directive,
  Input,
  ElementRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Directive({
  selector: '[appDoughnutChart]',
})
export class DoughnutChartDirective implements OnChanges {
  @Input() data: number[] = [];
  @Input() labels: string[] = [];
  @Input() isSkills: boolean = true;

  private chart: Chart | undefined;

  constructor(private el: ElementRef) {
    Chart.register(...registerables); // Register Chart.js components
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['labels']) {
      this.renderChart();
    }
  }

  private renderChart(): void {
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
        cutout: this.isSkills ? '65%' : '45%', // Adjust for thickness
        plugins: {
          legend: {
            display: true,
            position: 'right', // Set legend position to the right
            align: 'center', // Align the legend at the start
            labels: {
              usePointStyle: true, // Use a pie/point style instead of box
              pointStyle: 'circle',
              boxHeight: 14,
              boxWidth: 14,
              color: '#000', // Color of legend labels
              font: {
                size: 10, // Font size for legend labels
              },
            },
          },
          // Add a custom plugin for text rendering
          tooltip: {
            enabled: this.isSkills ? false : true, // Disable tooltips if desired
          },
        },
      },
      plugins: plugins,
    });
  }
}
