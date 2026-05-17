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
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

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
)

const Chart = ({ weeklyData, stats, region }) => {
  if (region === 'National' && weeklyData.length) {
    const lineData = {
      labels: weeklyData.map((d) => d.week_start?.slice(0, 10)),
      datasets: [
        {
          data: weeklyData.map((d) => Number(d.weighted_ili)),
          label: '% ILI',
          borderColor: '#3333ff',
          backgroundColor: 'rgba(51, 51, 255, 0.1)',
          fill: true,
        },
      ],
    }
    const lineOptions = {
      responsive: true,
      maintainAspectRatio: false,
    }
    return (
      <div className="h-64">
        <Line data={lineData} options={lineOptions} />
      </div>
    )
  }

  if (stats) {
    const barData = {
      labels: ['ILI Patients', 'Total Patients'],
      datasets: [
        {
          label: 'Patients',
          backgroundColor: ['rgba(0, 0, 255, 0.5)', 'rgba(0, 255, 0, 0.5)'],
          data: [Number(stats.ilitotal), Number(stats.total_patients)],
        },
      ],
    }
    const barOptions = {
      plugins: {
        legend: { display: false },
        title: { display: true, text: `Current state in ${region}` },
      },
    }
    return (
      <div className="h-64">
        <Bar data={barData} options={barOptions} />
      </div>
    )
  }

  return null
}

export default Chart
