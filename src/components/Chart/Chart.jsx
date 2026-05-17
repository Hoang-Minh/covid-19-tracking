import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

const Chart = ({ weeklyData }) => {
  if (!weeklyData || !weeklyData.length) return null

  const lineData = {
    labels: weeklyData.map((d) => d.week_end?.slice(0, 10)),
    datasets: [
      {
        data: weeklyData.map((d) => Number(d.percent_test_positivity)),
        label: '% Flu Test Positive',
        borderColor: '#3333ff',
        backgroundColor: 'rgba(51, 51, 255, 0.1)',
        fill: true,
      },
    ],
  }

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, text: 'Weekly Flu Test Positivity (National)' },
    },
  }

  return (
    <div className="h-64">
      <Line data={lineData} options={lineOptions} />
    </div>
  )
}

export default Chart
