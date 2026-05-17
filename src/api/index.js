import axios from 'axios'

const BASE_URL = import.meta.env.VITE_CDC_API_URL

export const fetchCurrentStats = async (region = 'National') => {
  try {
    const { data } = await axios.get(BASE_URL, {
      params: {
        $where: `region='${region}'`,
        $order: 'week_start DESC',
        $limit: 1,
      },
    })
    return data[0] || null
  } catch {
    return null
  }
}

export const fetchWeeklyTrend = async () => {
  try {
    const { data } = await axios.get(BASE_URL, {
      params: {
        $where: "region='National'",
        $order: 'week_start ASC',
        $limit: 52,
      },
    })
    return data
  } catch {
    return null
  }
}

export const fetchRegions = () => [
  'National',
  'Region 1',
  'Region 2',
  'Region 3',
  'Region 4',
  'Region 5',
  'Region 6',
  'Region 7',
  'Region 8',
  'Region 9',
  'Region 10',
]
