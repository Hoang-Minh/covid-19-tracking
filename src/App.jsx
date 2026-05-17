import { useState, useEffect } from 'react'
import { fetchCurrentStats, fetchWeeklyTrend } from './api'
import StatCardList from './components/StatCards/StatCardList'
import Chart from './components/Chart/Chart'

export default function App() {
  const [currentData, setCurrentData] = useState(null)
  const [weeklyData, setWeeklyData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(false)
      try {
        const [current, trend] = await Promise.all([
          fetchCurrentStats(),
          fetchWeeklyTrend(),
        ])
        if (!cancelled) {
          setCurrentData(current)
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
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Flu Tracker</h1>
      <p className="text-center text-gray-500 text-sm mb-6">
        US National Influenza Test Positivity — CDC Weekly Surveillance
      </p>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
          Flu data temporarily unavailable.
        </div>
      )}
      {loading ? (
        <div className="text-center text-gray-500 py-12">Loading...</div>
      ) : (
        <>
          <StatCardList currentData={currentData} />
          <Chart weeklyData={weeklyData} />
        </>
      )}
    </div>
  )
}
