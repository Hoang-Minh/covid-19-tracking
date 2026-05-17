import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { fetchCurrentStats, fetchWeeklyTrend } from './index'

vi.mock('axios')

beforeEach(() => {
  vi.clearAllMocks()
})

const weekRecord = (weekEnd, pct) => ({
  week_end: weekEnd,
  pathogen: 'Influenza',
  percent_test_positivity: pct,
})

describe('fetchCurrentStats', () => {
  it('returns array of 2 records when API has data', async () => {
    const records = [
      weekRecord('2026-05-09', '2.9'),
      weekRecord('2026-05-02', '3.0'),
    ]
    axios.get.mockResolvedValueOnce({ data: records })
    const result = await fetchCurrentStats()
    expect(result).toEqual(records)
    expect(result).toHaveLength(2)
  })

  it('filters for Influenza pathogen', async () => {
    axios.get.mockResolvedValueOnce({ data: [weekRecord('2026-05-09', '2.9'), weekRecord('2026-05-02', '3.0')] })
    await fetchCurrentStats()
    expect(axios.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        params: expect.objectContaining({ $where: "pathogen='Influenza'" }),
      })
    )
  })

  it('returns null when API returns fewer than 2 records', async () => {
    axios.get.mockResolvedValueOnce({ data: [weekRecord('2026-05-09', '2.9')] })
    const result = await fetchCurrentStats()
    expect(result).toBeNull()
  })

  it('returns null on network error', async () => {
    axios.get.mockRejectedValueOnce(new Error('network'))
    const result = await fetchCurrentStats()
    expect(result).toBeNull()
  })
})

describe('fetchWeeklyTrend', () => {
  it('returns array of weekly records ordered oldest-first', async () => {
    const records = [
      weekRecord('2025-06-01', '1.2'),
      weekRecord('2025-06-08', '1.5'),
    ]
    axios.get.mockResolvedValueOnce({ data: records })
    const result = await fetchWeeklyTrend()
    expect(result).toEqual(records)
  })

  it('requests up to 52 weeks', async () => {
    axios.get.mockResolvedValueOnce({ data: [] })
    await fetchWeeklyTrend()
    expect(axios.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        params: expect.objectContaining({ $limit: 52 }),
      })
    )
  })

  it('returns null on error', async () => {
    axios.get.mockRejectedValueOnce(new Error('timeout'))
    const result = await fetchWeeklyTrend()
    expect(result).toBeNull()
  })
})
