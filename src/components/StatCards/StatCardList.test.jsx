import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import StatCardList from './StatCardList'

const mockStats = {
  ilitotal: '150',
  total_patients: '1500',
  weighted_ili: '2.75',
}

describe('StatCardList', () => {
  it('renders three card titles', () => {
    render(<StatCardList stats={mockStats} />)
    expect(screen.getByText('ILI Patients')).toBeInTheDocument()
    expect(screen.getByText('Total Patients')).toBeInTheDocument()
    expect(screen.getByText('% ILI')).toBeInTheDocument()
  })

  it('displays formatted ILI patient count', () => {
    render(<StatCardList stats={mockStats} />)
    expect(screen.getByText('150')).toBeInTheDocument()
  })

  it('displays % ILI with two decimal places and % symbol', () => {
    render(<StatCardList stats={mockStats} />)
    expect(screen.getByText('2.75%')).toBeInTheDocument()
  })

  it('renders — for all three values when stats is null', () => {
    render(<StatCardList stats={null} />)
    const dashes = screen.getAllByText('—')
    expect(dashes).toHaveLength(3)
  })
})
