import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoyaltySettings from './LoyaltySettings'
import { saveLoyaltySettings, getLoyaltySettings } from '../utils/loyaltySettings'

describe('LoyaltySettings', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('Initial load', () => {
    it('loads default settings when none exist', () => {
      render(<LoyaltySettings />)

      const pointsInput = screen.getByLabelText(/Spend ₦/i)
      const thresholdInput = screen.getByLabelText(/Reward available at/i)

      expect(pointsInput).toHaveValue(1000)
      expect(thresholdInput).toHaveValue(50)
    })

    it('loads existing settings from storage', () => {
      saveLoyaltySettings({ pointsPerUnit: 500, rewardThreshold: 25 })

      render(<LoyaltySettings />)

      const pointsInput = screen.getByLabelText(/Spend ₦/i)
      const thresholdInput = screen.getByLabelText(/Reward available at/i)

      expect(pointsInput).toHaveValue(500)
      expect(thresholdInput).toHaveValue(25)
    })
  })

  describe('Helper text', () => {
    it('displays helper text about future sales', () => {
      render(<LoyaltySettings />)

      expect(
        screen.getByText(/Changes apply to future sales only/i)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/Past sales won't be affected/i)
      ).toBeInTheDocument()
    })
  })

  describe('Saving valid settings', () => {
    it('saves valid settings when Save is clicked', async () => {
      const user = userEvent.setup()
      render(<LoyaltySettings />)

      const pointsInput = screen.getByLabelText(/Spend ₦/i)
      const thresholdInput = screen.getByLabelText(/Reward available at/i)

      await user.clear(pointsInput)
      await user.type(pointsInput, '2000')
      await user.clear(thresholdInput)
      await user.type(thresholdInput, '100')

      const saveButton = screen.getByRole('button', { name: /Save Settings/i })
      await user.click(saveButton)

      const settings = getLoyaltySettings()
      expect(settings.pointsPerUnit).toBe(2000)
      expect(settings.rewardThreshold).toBe(100)
    })

    it('shows success message after saving', async () => {
      const user = userEvent.setup()
      render(<LoyaltySettings />)

      const saveButton = screen.getByRole('button', { name: /Save Settings/i })
      await user.click(saveButton)

      expect(screen.getByText(/Settings saved/i)).toBeInTheDocument()
    })
  })

  describe('Validation', () => {
    it('disables Save button when pointsPerUnit is empty', async () => {
      const user = userEvent.setup()
      render(<LoyaltySettings />)

      const pointsInput = screen.getByLabelText(/Spend ₦/i)
      await user.clear(pointsInput)

      const saveButton = screen.getByRole('button', { name: /Save Settings/i })
      expect(saveButton).toBeDisabled()
    })

    it('disables Save button when rewardThreshold is empty', async () => {
      const user = userEvent.setup()
      render(<LoyaltySettings />)

      const thresholdInput = screen.getByLabelText(/Reward available at/i)
      await user.clear(thresholdInput)

      const saveButton = screen.getByRole('button', { name: /Save Settings/i })
      expect(saveButton).toBeDisabled()
    })

    it('disables Save button when pointsPerUnit is 0', async () => {
      const user = userEvent.setup()
      render(<LoyaltySettings />)

      const pointsInput = screen.getByLabelText(/Spend ₦/i)
      await user.clear(pointsInput)
      await user.type(pointsInput, '0')

      const saveButton = screen.getByRole('button', { name: /Save Settings/i })
      expect(saveButton).toBeDisabled()
    })

    it('disables Save button when rewardThreshold is negative', async () => {
      const user = userEvent.setup()
      render(<LoyaltySettings />)

      const thresholdInput = screen.getByLabelText(/Reward available at/i)
      await user.clear(thresholdInput)
      await user.type(thresholdInput, '-5')

      const saveButton = screen.getByRole('button', { name: /Save Settings/i })
      expect(saveButton).toBeDisabled()
    })

    it('shows error message for invalid pointsPerUnit', async () => {
      const user = userEvent.setup()
      render(<LoyaltySettings />)

      const pointsInput = screen.getByLabelText(/Spend ₦/i)
      await user.clear(pointsInput)
      await user.type(pointsInput, '0')

      expect(screen.getByText(/Must be a whole number ≥ 1/i)).toBeInTheDocument()
    })

    it('shows error message for invalid rewardThreshold', async () => {
      const user = userEvent.setup()
      render(<LoyaltySettings />)

      const thresholdInput = screen.getByLabelText(/Reward available at/i)
      await user.clear(thresholdInput)
      await user.type(thresholdInput, '-10')

      expect(screen.getByText(/Must be a whole number ≥ 1/i)).toBeInTheDocument()
    })

    it('enables Save button when inputs become valid again', async () => {
      const user = userEvent.setup()
      render(<LoyaltySettings />)

      const pointsInput = screen.getByLabelText(/Spend ₦/i)
      const saveButton = screen.getByRole('button', { name: /Save Settings/i })

      // Make invalid
      await user.clear(pointsInput)
      expect(saveButton).toBeDisabled()

      // Make valid again
      await user.type(pointsInput, '500')
      expect(saveButton).toBeEnabled()
    })
  })

  describe('UI elements', () => {
    it('renders section title', () => {
      render(<LoyaltySettings />)

      expect(screen.getByText('Loyalty Rules')).toBeInTheDocument()
    })

    it('renders points-per-unit input with label', () => {
      render(<LoyaltySettings />)

      expect(screen.getByLabelText(/Spend ₦/i)).toBeInTheDocument()
      expect(screen.getByText(/→ Earn 1 point/i)).toBeInTheDocument()
    })

    it('renders reward threshold input with label', () => {
      render(<LoyaltySettings />)

      expect(screen.getByLabelText(/Reward available at/i)).toBeInTheDocument()
      expect(screen.getByText(/points$/)).toBeInTheDocument()
    })
  })

  describe('Last updated timestamp', () => {
    it('does not show timestamp when no settings have been saved', () => {
      render(<LoyaltySettings />)

      expect(screen.queryByText(/Last updated/i)).not.toBeInTheDocument()
    })

    it('shows timestamp when settings have updatedAt', () => {
      saveLoyaltySettings({ pointsPerUnit: 500, rewardThreshold: 25 })

      render(<LoyaltySettings />)

      expect(screen.getByText(/Last updated/i)).toBeInTheDocument()
    })

    it('shows "Just now" immediately after saving', async () => {
      const user = userEvent.setup()
      render(<LoyaltySettings />)

      const saveButton = screen.getByRole('button', { name: /Save Settings/i })
      await user.click(saveButton)

      expect(screen.getByText(/Just now/i)).toBeInTheDocument()
    })

    it('does not show timestamp for legacy settings without updatedAt', () => {
      localStorage.setItem(
        'salesApp_loyaltySettings',
        JSON.stringify({ pointsPerUnit: 500, rewardThreshold: 25 })
      )

      render(<LoyaltySettings />)

      expect(screen.queryByText(/Last updated/i)).not.toBeInTheDocument()
    })
  })
})
