"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

interface LineChartProps {
  labels: string[];
  data: number[];
  label: string;
  color?: string;
}

export function SustainabilityLineChart({
  labels,
  data,
  label,
  color = "#FF9933",
}: LineChartProps) {
  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            label,
            data,
            borderColor: color,
            backgroundColor: color + "33",
            fill: true,
            tension: 0.4,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      }}
    />
  );
}

export function SustainabilityBarChart({
  labels,
  data,
  label,
  color = "#138808",
}: LineChartProps) {
  return (
    <Bar
      data={{
        labels,
        datasets: [{ label, data, backgroundColor: color + "CC" }],
      }}
      options={{
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      }}
    />
  );
}

interface GaugeProps {
  score: number;
  size?: number;
}

export function GreenScoreGauge({ score, size = 160 }: GaugeProps) {
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <Doughnut
        data={{
          datasets: [
            {
              data: [score, 100 - score],
              backgroundColor: ["#138808", "#e5e7eb"],
              borderWidth: 0,
            },
          ],
        }}
        options={{
          cutout: "75%",
          responsive: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
        }}
        width={size}
        height={size}
      />
      <div className="absolute text-center">
        <p className="text-3xl font-bold text-india-green">{score}</p>
        <p className="text-xs text-gray-500">Green Score</p>
      </div>
    </div>
  );
}

export function getMonthlyLabels(): string[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const labels: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(months[d.getMonth()]);
  }
  return labels;
}
