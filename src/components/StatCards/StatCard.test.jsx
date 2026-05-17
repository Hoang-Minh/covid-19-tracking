import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import StatCard from './StatCard'

describe('StatCard', () => {
  it('renders the title', () => {
    render(<StatCard title="ILI Patients" value={100} subtitle="test" colorClass="border-blue-500" />)
    expect(screen.getByText('ILI Patients')).toBeInTheDocument()
  })

  it('formats large numbers with commas', () => {
    render(<StatCard title="ILI Patients" value={12345} subtitle="test" colorClass="border-blue-500" />)
    expect(screen.getByText('12,345')).toBeInTheDocument()
  })

  it('renders string values as-is', () => {
    render(<StatCard title="% ILI" value="2.50%" subtitle="test" colorClass="border-red-500" />)
    expect(screen.getByText('2.50%')).toBeInTheDocument()
  })

  it('renders — when value is null', () => {
    render(<StatCard title="ILI Patients" value={null} subtitle="test" colorClass="border-blue-500" />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(<StatCard title="T" value={1} subtitle="Patients with ILI" colorClass="border-blue-500" />)
    expect(screen.getByText('Patients with ILI')).toBeInTheDocument()
  })
})
