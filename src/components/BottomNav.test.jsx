import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BottomNav from './BottomNav'

describe('BottomNav', () => {
  describe('rendering', () => {
    it('renders exactly 3 tabs', () => {
      const onNavigate = vi.fn()
      render(<BottomNav currentView="list" onNavigate={onNavigate} />)

      const tabs = screen.getAllByRole('button')
      expect(tabs).toHaveLength(3)
    })

    it('renders Customers, Dashboard, and Settings labels', () => {
      const onNavigate = vi.fn()
      render(<BottomNav currentView="list" onNavigate={onNavigate} />)

      expect(screen.getByText('Customers')).toBeInTheDocument()
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
    })

    it('has navigation landmark', () => {
      const onNavigate = vi.fn()
      render(<BottomNav currentView="list" onNavigate={onNavigate} />)

      expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument()
    })
  })

  describe('active tab resolution', () => {
    it('shows Customers as active for list view', () => {
      const onNavigate = vi.fn()
      render(<BottomNav currentView="list" onNavigate={onNavigate} />)

      const customersTab = screen.getByText('Customers').closest('button')
      expect(customersTab).toHaveClass('bottom-nav-tab--active')
    })

    it('shows Customers as active for detail view', () => {
      const onNavigate = vi.fn()
      render(<BottomNav currentView="detail" onNavigate={onNavigate} />)

      const customersTab = screen.getByText('Customers').closest('button')
      expect(customersTab).toHaveClass('bottom-nav-tab--active')
    })

    it('shows Customers as active for addCustomer view', () => {
      const onNavigate = vi.fn()
      render(<BottomNav currentView="addCustomer" onNavigate={onNavigate} />)

      const customersTab = screen.getByText('Customers').closest('button')
      expect(customersTab).toHaveClass('bottom-nav-tab--active')
    })

    it('shows Customers as active for editCustomer view', () => {
      const onNavigate = vi.fn()
      render(<BottomNav currentView="editCustomer" onNavigate={onNavigate} />)

      const customersTab = screen.getByText('Customers').closest('button')
      expect(customersTab).toHaveClass('bottom-nav-tab--active')
    })

    it('shows Customers as active for recordSale view', () => {
      const onNavigate = vi.fn()
      render(<BottomNav currentView="recordSale" onNavigate={onNavigate} />)

      const customersTab = screen.getByText('Customers').closest('button')
      expect(customersTab).toHaveClass('bottom-nav-tab--active')
    })

    it('shows Dashboard as active for dashboard view', () => {
      const onNavigate = vi.fn()
      render(<BottomNav currentView="dashboard" onNavigate={onNavigate} />)

      const dashboardTab = screen.getByText('Dashboard').closest('button')
      expect(dashboardTab).toHaveClass('bottom-nav-tab--active')
    })

    it('shows Settings as active for settings view', () => {
      const onNavigate = vi.fn()
      render(<BottomNav currentView="settings" onNavigate={onNavigate} />)

      const settingsTab = screen.getByText('Settings').closest('button')
      expect(settingsTab).toHaveClass('bottom-nav-tab--active')
    })

    it('shows Settings as active when isSettingsOpen is true', () => {
      const onNavigate = vi.fn()
      render(<BottomNav currentView="dashboard" onNavigate={onNavigate} isSettingsOpen={true} />)

      const settingsTab = screen.getByText('Settings').closest('button')
      expect(settingsTab).toHaveClass('bottom-nav-tab--active')
    })

    it('defaults to Customers for unknown view', () => {
      const onNavigate = vi.fn()
      render(<BottomNav currentView="unknown" onNavigate={onNavigate} />)

      const customersTab = screen.getByText('Customers').closest('button')
      expect(customersTab).toHaveClass('bottom-nav-tab--active')
    })
  })

  describe('navigation', () => {
    it('calls onNavigate with list when Customers tab is clicked', async () => {
      const user = userEvent.setup()
      const onNavigate = vi.fn()
      render(<BottomNav currentView="dashboard" onNavigate={onNavigate} />)

      await user.click(screen.getByText('Customers'))
      expect(onNavigate).toHaveBeenCalledWith('list')
    })

    it('calls onNavigate with dashboard when Dashboard tab is clicked', async () => {
      const user = userEvent.setup()
      const onNavigate = vi.fn()
      render(<BottomNav currentView="list" onNavigate={onNavigate} />)

      await user.click(screen.getByText('Dashboard'))
      expect(onNavigate).toHaveBeenCalledWith('dashboard')
    })

    it('calls onNavigate with settings when Settings tab is clicked', async () => {
      const user = userEvent.setup()
      const onNavigate = vi.fn()
      render(<BottomNav currentView="list" onNavigate={onNavigate} />)

      await user.click(screen.getByText('Settings'))
      expect(onNavigate).toHaveBeenCalledWith('settings')
    })

    it('does not call onNavigate when clicking the already active tab', async () => {
      const user = userEvent.setup()
      const onNavigate = vi.fn()
      render(<BottomNav currentView="list" onNavigate={onNavigate} />)

      await user.click(screen.getByText('Customers'))
      expect(onNavigate).not.toHaveBeenCalled()
    })
  })

  describe('accessibility', () => {
    it('sets aria-current on active tab', () => {
      const onNavigate = vi.fn()
      render(<BottomNav currentView="dashboard" onNavigate={onNavigate} />)

      const dashboardTab = screen.getByText('Dashboard').closest('button')
      expect(dashboardTab).toHaveAttribute('aria-current', 'page')

      const customersTab = screen.getByText('Customers').closest('button')
      expect(customersTab).not.toHaveAttribute('aria-current')
    })
  })
})
