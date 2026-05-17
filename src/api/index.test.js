import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { fetchCurrentStats, fetchWeeklyTrend, fetchRegions } from './index'

vi.mock('axios')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('fetchCurrentStats', () => {
  it('returns the latest record for the given region', async () => {
    const record = { ilitotal: '200', total_patients: '2000', weighted_ili: '3.1', week_start: '2024-11-01' }
    axios.get.mockResolvedValueOnce({ data: [record] })
    const result = await fetchCurrentStats('National')
    expect(result).toEqual(record)
  })

  it('passes region as a $where query param', async () => {
    axios.get.mockResolvedValueOnce({ data: [{}] })
    await fetchCurrentStats('Region 5')
    expect(axios.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        params: expect.objectContaining({ $where: "region='Region 5'" }),
      })
    )
  })

  it('returns null on network error', async () => {
    axios.get.mockRejectedValueOnce(new Error('network'))
    const result = await fetchCurrentStats('National')
    expect(result).toBeNull()
  })

  it('returns null when API returns empty array', async () => {
    axios.get.mockResolvedValueOnce({ data: [] })
    const result = await fetchCurrentStats('National')
    expect(result).toBeNull()
  })
})

describe('fetchWeeklyTrend', () => {
  it('returns an array of weekly records', async () => {
    const records = [
      { week_start: '2024-01-01', weighted_ili: '1.2' },
      { week_start: '2024-01-08', weighted_ili: '1.5' },
    ]
    axios.get.mockResolvedValueOnce({ data: records })
    const result = await fetchWeeklyTrend()
    expect(result).toEqual(records)
  })

  it('returns null on error', async () => {
    axios.get.mockRejectedValueOnce(new Error('timeout'))
    const result = await fetchWeeklyTrend()
    expect(result).toBeNull()
  })
})

describe('fetchRegions', () => {
  it('returns National plus 10 HHS regions without a network call', () => {
    const regions = fetchRegions()
    expect(axios.get).not.toHaveBeenCalled()
    expect(regions).toHaveLength(11)
    expect(regions[0]).toBe('National')
    expect(regions[10]).toBe('Region 10')
  })
})
