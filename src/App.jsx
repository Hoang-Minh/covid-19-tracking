import { useState, useEffect } from 'react'
import { fetchCurrentStats, fetchWeeklyTrend } from './api'
import StatCardList from './components/StatCards/StatCardList'
import RegionPicker from './components/RegionPicker/RegionPicker'
import Chart from './components/Chart/Chart'

export default function App() {
  const [stats, setStats] = useState(null)
  const [weeklyData, setWeeklyData] = useState([])
  const [region, setRegion] = useState('National')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(false)
      try {
        const [statsData, trend] = await Promise.all([
          fetchCurrentStats(region),
          region === 'National' ? fetchWeeklyTrend() : Promise.resolve([]),
        ])
        if (!cancelled) {
          setStats(statsData)
          setWeeklyData(trend || [])
        }
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [region])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Flu Tracker</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
          Flu data temporarily unavailable.
        </div>
      )}
      <RegionPicker region={region} onRegionChange={setRegion} />
      {loading ? (
        <div className="text-center text-gray-500 py-12">Loading...</div>
      ) : (
        <>
          <StatCardList stats={stats} />
          <Chart weeklyData={weeklyData} stats={stats} region={region} />
        </>
      )}
    </div>
  )
}
