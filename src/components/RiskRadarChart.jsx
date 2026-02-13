import { useMemo } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { DIMENSIONS } from '../lib/riskEngine';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function RiskRadarChart({ scores }) {
  const data = useMemo(() => {
    const values = DIMENSIONS.map((d) => scores[d] ?? 0);
    return {
      labels: DIMENSIONS,
      datasets: [
        {
          label: 'Financial safety score',
          data: values,
          backgroundColor: 'rgba(16, 185, 129, 0.25)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 3,
          pointBackgroundColor: 'rgb(16, 185, 129)',
          pointBorderColor: 'rgba(240, 244, 248, 1)',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverBackgroundColor: 'rgb(5, 150, 105)',
          pointHoverBorderColor: '#fff',
          pointHoverRadius: 7,
        },
      ],
    };
  }, [scores]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 20,
            backdropColor: 'transparent',
            color: 'rgba(148, 163, 184, 0.8)',
            font: {
              size: 11,
              weight: 600,
            },
          },
          pointLabels: {
            color: 'rgba(240, 244, 248, 0.95)',
            font: { 
              size: 13,
              weight: 600,
            },
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
            lineWidth: 1,
          },
          angleLines: {
            color: 'rgba(255, 255, 255, 0.1)',
            lineWidth: 1,
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(19, 23, 34, 0.95)',
          borderColor: 'rgba(16, 185, 129, 0.5)',
          borderWidth: 1,
          padding: 12,
          titleColor: 'rgba(240, 244, 248, 1)',
          bodyColor: 'rgba(240, 244, 248, 0.9)',
          titleFont: {
            size: 13,
            weight: 700,
          },
          bodyFont: {
            size: 12,
            weight: 500,
          },
          callbacks: {
            label: (ctx) => ` ${ctx.raw}/100 (higher = safer)`,
          },
        },
      },
    }),
    []
  );

  return (
    <div className="radar-wrap">
      <Radar data={data} options={options} />
    </div>
  );
}
