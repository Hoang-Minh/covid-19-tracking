import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('react-chartjs-2', () => ({
  Line: (_props) => <canvas data-testid="line-chart" />,
  Bar: (_props) => <canvas data-testid="bar-chart" />,
}))

import Chart from './Chart'

describe('Chart', () => {
  const weeklyData = [
    { week_start: '2024-01-01', weighted_ili: '1.5' },
    { week_start: '2024-01-08', weighted_ili: '2.0' },
  ]
  const stats = { ilitotal: '300', total_patients: '3000', weighted_ili: '2.1' }

  it('renders line chart for National view with weekly data', () => {
    render(<Chart weeklyData={weeklyData} stats={null} region="National" />)
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
  })

  it('renders bar chart for a specific region', () => {
    render(<Chart weeklyData={[]} stats={stats} region="Region 4" />)
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
  })

  it('renders nothing when National has no weekly data', () => {
    const { container } = render(<Chart weeklyData={[]} stats={null} region="National" />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when region stats are null', () => {
    const { container } = render(<Chart weeklyData={[]} stats={null} region="Region 2" />)
    expect(container.firstChild).toBeNull()
  })
})
