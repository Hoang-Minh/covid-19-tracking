import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import StatCardList from './StatCardList'

const mockData = [
  { week_end: '2026-05-09T00:00:00.000', pathogen: 'Influenza', percent_test_positivity: '2.9' },
  { week_end: '2026-05-02T00:00:00.000', pathogen: 'Influenza', percent_test_positivity: '3.0' },
]

describe('StatCardList', () => {
  it('renders three card titles', () => {
    render(<StatCardList currentData={mockData} />)
    expect(screen.getByText('This Week')).toBeInTheDocument()
    expect(screen.getByText('Last Week')).toBeInTheDocument()
    expect(screen.getByText('Change')).toBeInTheDocument()
  })

  it('displays this week positivity formatted to 1 decimal', () => {
    render(<StatCardList currentData={mockData} />)
    expect(screen.getByText('2.9%')).toBeInTheDocument()
  })

  it('displays last week positivity formatted to 1 decimal', () => {
    render(<StatCardList currentData={mockData} />)
    expect(screen.getByText('3.0%')).toBeInTheDocument()
  })

  it('displays negative change when flu is declining', () => {
    render(<StatCardList currentData={mockData} />)
    expect(screen.getByText('-0.1pp')).toBeInTheDocument()
  })

  it('displays positive change when flu is rising', () => {
    const risingData = [
      { week_end: '2026-05-09T00:00:00.000', pathogen: 'Influenza', percent_test_positivity: '3.5' },
      { week_end: '2026-05-02T00:00:00.000', pathogen: 'Influenza', percent_test_positivity: '3.0' },
    ]
    render(<StatCardList currentData={risingData} />)
    expect(screen.getByText('+0.5pp')).toBeInTheDocument()
  })

  it('renders — for all three values when currentData is null', () => {
    render(<StatCardList currentData={null} />)
    const dashes = screen.getAllByText('—')
    expect(dashes).toHaveLength(3)
  })
})
