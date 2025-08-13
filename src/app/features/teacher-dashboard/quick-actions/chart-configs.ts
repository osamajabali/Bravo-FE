import { ChartConfiguration } from 'chart.js';

export interface ChartDataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string | CanvasGradient;
  borderWidth: number;
  fill?: boolean;
  tension?: number;
  pointRadius?: number;
  pointHoverRadius?: number;
  pointBackgroundColor?: string;
  pointBorderColor?: string;
  borderRadius?: any;
  borderSkipped?: boolean;
  stack?: string;
  barThickness?: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

// Sample data for charts
export const questionsChartData: ChartData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
  datasets: [
    {
      label: 'Wrong',
      data: [35, 28, 42, 25, 37],
      backgroundColor: '#3b8fa7',
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
      data: [85, 92, 78, 105, 88],
      backgroundColor: '#54c8e8',
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

export const timeChartData: ChartData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
  datasets: [
    {
      label: 'School Avg',
      data: [2.5, 3.2, 2.8, 3.5, 3.0],
      borderColor: '#3B8FA7',
      backgroundColor: '#3B8FA7',
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
      data: [1.8, 2.5, 2.2, 5.8, 2.3],
      borderColor: '#54c8e8',
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

// Chart configuration factory functions
export function createQuestionsChartConfig(data: ChartData): ChartConfiguration {
  return {
    type: 'bar',
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 20,
          right: 20
        }
      },
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
}

export function createTimeChartConfig(data: ChartData): ChartConfiguration {
  return {
    type: 'line',
    data,
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
            color: '#565656'
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
}
