import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import RegionPicker from './RegionPicker'

describe('RegionPicker', () => {
  it('renders 11 options (National + 10 HHS regions)', () => {
    render(<RegionPicker region="National" onRegionChange={() => {}} />)
    expect(screen.getAllByRole('option')).toHaveLength(11)
  })

  it('shows National as the first option', () => {
    render(<RegionPicker region="National" onRegionChange={() => {}} />)
    const options = screen.getAllByRole('option')
    expect(options[0].textContent).toBe('National')
  })

  it('calls onRegionChange with the selected value', async () => {
    const handler = vi.fn()
    render(<RegionPicker region="National" onRegionChange={handler} />)
    await userEvent.selectOptions(screen.getByRole('combobox'), 'Region 3')
    expect(handler).toHaveBeenCalledWith('Region 3')
  })

  it('reflects the controlled region prop as the current value', () => {
    render(<RegionPicker region="Region 5" onRegionChange={() => {}} />)
    expect(screen.getByRole('combobox')).toHaveValue('Region 5')
  })
})
