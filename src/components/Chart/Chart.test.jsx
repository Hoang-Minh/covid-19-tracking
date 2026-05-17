import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('react-chartjs-2', () => ({
  Line: (_props) => <canvas data-testid="line-chart" />,
}))

import Chart from './Chart'

describe('Chart', () => {
  const weeklyData = [
    { week_end: '2025-01-01T00:00:00.000', percent_test_positivity: '5.2' },
    { week_end: '2025-01-08T00:00:00.000', percent_test_positivity: '6.0' },
  ]

  it('renders line chart when weekly data is available', () => {
    render(<Chart weeklyData={weeklyData} />)
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
  })

  it('renders nothing when weeklyData is empty', () => {
    const { container } = render(<Chart weeklyData={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when weeklyData is null', () => {
    const { container } = render(<Chart weeklyData={null} />)
    expect(container.firstChild).toBeNull()
  })
})
