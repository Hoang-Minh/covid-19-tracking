import axios from 'axios'

const BASE_URL = import.meta.env.VITE_CDC_API_URL

export const fetchCurrentStats = async () => {
  try {
    const { data } = await axios.get(BASE_URL, {
      params: {
        $where: "pathogen='Influenza'",
        $order: 'week_end DESC',
        $limit: 2,
      },
    })
    return data.length >= 2 ? data : null
  } catch {
    return null
  }
}

export const fetchWeeklyTrend = async () => {
  try {
    const { data } = await axios.get(BASE_URL, {
      params: {
        $where: "pathogen='Influenza'",
        $order: 'week_end ASC',
        $limit: 52,
      },
    })
    return data
  } catch {
    return null
  }
}
