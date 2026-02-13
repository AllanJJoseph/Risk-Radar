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
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 2,
          pointBackgroundColor: 'rgb(34, 197, 94)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(34, 197, 94)',
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
            color: 'rgba(255,255,255,0.7)',
          },
          pointLabels: {
            color: 'rgba(255,255,255,0.95)',
            font: { size: 12 },
          },
          grid: {
            color: 'rgba(255,255,255,0.15)',
          },
          angleLines: {
            color: 'rgba(255,255,255,0.15)',
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
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
