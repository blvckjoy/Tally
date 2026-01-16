import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Dashboard from './Dashboard'

// Mock the dashboardCalculator utilities
vi.mock('../utils/dashboardCalculator', () => ({
  getTodayRevenue: vi.fn(),
  getTodayTransactions: vi.fn(),
  getMonthlyRevenue: vi.fn(),
  getMonthlyTransactions: vi.fn(),
  getAverageSale: vi.fn(),
  getRewardsPendingCount: vi.fn(),
  getTopCustomers: vi.fn(),
}))

import {
  getTodayRevenue,
  getTodayTransactions,
  getMonthlyRevenue,
  getMonthlyTransactions,
  getAverageSale,
  getRewardsPendingCount,
  getTopCustomers,
} from '../utils/dashboardCalculator'

describe('Dashboard', () => {
  const mockSales = [
    {
      id: 'sale_1',
      customerId: 'customer_1',
      amount: 5000,
      pointsEarned: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'sale_2',
      customerId: 'customer_2',
      amount: 7500,
      pointsEarned: 7,
      createdAt: new Date().toISOString(),
    },
  ]

  const mockCustomers = [
    {
      id: 'customer_1',
      name: 'Alice Johnson',
      phone: '555-1234',
      notes: '',
      dateAdded: '2024-01-15T10:00:00Z',
    },
    {
      id: 'customer_2',
      name: 'Bob Smith',
      phone: '555-5678',
      notes: '',
      dateAdded: '2024-01-20T14:30:00Z',
    },
  ]

  const mockOnBack = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    // Set default mock return values
    getTodayRevenue.mockReturnValue(12500)
    getTodayTransactions.mockReturnValue(2)
    getMonthlyRevenue.mockReturnValue(50000)
    getMonthlyTransactions.mockReturnValue(10)
    getAverageSale.mockReturnValue(5000)
    getRewardsPendingCount.mockReturnValue(1)
    getTopCustomers.mockReturnValue([
      { customer: mockCustomers[0], totalPoints: 25 },
      { customer: mockCustomers[1], totalPoints: 15 },
    ])
  })

  describe('Display tests', () => {
    it('renders dashboard header', () => {
      render(
        <Dashboard sales={mockSales} customers={mockCustomers} onBack={mockOnBack} />
      )

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })

    it('displays today\'s revenue formatted as currency', () => {
      render(
        <Dashboard sales={mockSales} customers={mockCustomers} onBack={mockOnBack} />
      )

      // Today's revenue should be ₦12,500
      expect(screen.getByText('₦12,500')).toBeInTheDocument()
    })

    it('displays today\'s transactions count', () => {
      render(
        <Dashboard sales={mockSales} customers={mockCustomers} onBack={mockOnBack} />
      )

      // There are multiple "Transactions:" labels, check that at least one exists
      const transactionsLabels = screen.getAllByText('Transactions:')
      expect(transactionsLabels.length).toBeGreaterThan(0)
      // Today's transactions is 2 (may appear multiple times along with total customers)
      const twos = screen.getAllByText('2')
      expect(twos.length).toBeGreaterThan(0)
    })

    it('displays monthly revenue formatted as currency', () => {
      render(
        <Dashboard sales={mockSales} customers={mockCustomers} onBack={mockOnBack} />
      )

      expect(screen.getByText(/50,000/)).toBeInTheDocument()
    })

    it('displays monthly transactions count', () => {
      getMonthlyTransactions.mockReturnValue(10)
      render(
        <Dashboard sales={mockSales} customers={mockCustomers} onBack={mockOnBack} />
      )

      expect(screen.getByText('10')).toBeInTheDocument()
    })

    it('displays average sale formatted as currency', () => {
      render(
        <Dashboard sales={mockSales} customers={mockCustomers} onBack={mockOnBack} />
      )

      expect(screen.getByText('Average Sale:')).toBeInTheDocument()
      expect(screen.getByText(/5,000/)).toBeInTheDocument()
    })

    it('displays total customers count', () => {
      render(
        <Dashboard sales={mockSales} customers={mockCustomers} onBack={mockOnBack} />
      )

      expect(screen.getByText('Total Customers:')).toBeInTheDocument()
    })

    it('displays rewards pending count', () => {
      render(
        <Dashboard sales={mockSales} customers={mockCustomers} onBack={mockOnBack} />
      )

      expect(screen.getByText('Rewards Pending:')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
    })

    it('displays top customers list', () => {
      render(
        <Dashboard sales={mockSales} customers={mockCustomers} onBack={mockOnBack} />
      )

      expect(screen.getByText('Top Customers')).toBeInTheDocument()
    })

    it('shows customer name and points in top customers', () => {
      render(
        <Dashboard sales={mockSales} customers={mockCustomers} onBack={mockOnBack} />
      )

      expect(screen.getByText(/Alice Johnson/)).toBeInTheDocument()
      expect(screen.getByText(/25 points/)).toBeInTheDocument()
      expect(screen.getByText(/Bob Smith/)).toBeInTheDocument()
      expect(screen.getByText(/15 points/)).toBeInTheDocument()
    })

    it('shows empty state when no customers have points', () => {
      getTopCustomers.mockReturnValue([])
      render(
        <Dashboard sales={mockSales} customers={mockCustomers} onBack={mockOnBack} />
      )

      expect(screen.getByText('No customers with points yet')).toBeInTheDocument()
    })
  })

  describe('Interaction tests', () => {
    it('calls onBack when back button clicked', async () => {
      const user = userEvent.setup()
      render(
        <Dashboard sales={mockSales} customers={mockCustomers} onBack={mockOnBack} />
      )

      const backButton = screen.getByRole('button', { name: /back to customers/i })
      await user.click(backButton)

      expect(mockOnBack).toHaveBeenCalled()
    })
  })

  describe('Edge cases', () => {
    it('handles empty sales array', () => {
      getTodayRevenue.mockReturnValue(0)
      getTodayTransactions.mockReturnValue(0)
      getMonthlyRevenue.mockReturnValue(0)
      getMonthlyTransactions.mockReturnValue(0)
      getAverageSale.mockReturnValue(0)
      getRewardsPendingCount.mockReturnValue(0)
      getTopCustomers.mockReturnValue([])

      render(
        <Dashboard sales={[]} customers={mockCustomers} onBack={mockOnBack} />
      )

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      // Should show ₦0 for revenue
      expect(screen.getAllByText('₦0').length).toBeGreaterThan(0)
    })

    it('handles empty customers array', () => {
      getRewardsPendingCount.mockReturnValue(0)
      getTopCustomers.mockReturnValue([])

      render(
        <Dashboard sales={mockSales} customers={[]} onBack={mockOnBack} />
      )

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('No customers with points yet')).toBeInTheDocument()
    })

    it('handles null sales prop defensively', () => {
      getTodayRevenue.mockReturnValue(0)
      getTodayTransactions.mockReturnValue(0)
      getMonthlyRevenue.mockReturnValue(0)
      getMonthlyTransactions.mockReturnValue(0)
      getAverageSale.mockReturnValue(0)
      getRewardsPendingCount.mockReturnValue(0)
      getTopCustomers.mockReturnValue([])

      render(
        <Dashboard sales={null} customers={mockCustomers} onBack={mockOnBack} />
      )

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })

    it('handles undefined sales prop defensively', () => {
      getTodayRevenue.mockReturnValue(0)
      getTodayTransactions.mockReturnValue(0)
      getMonthlyRevenue.mockReturnValue(0)
      getMonthlyTransactions.mockReturnValue(0)
      getAverageSale.mockReturnValue(0)
      getRewardsPendingCount.mockReturnValue(0)
      getTopCustomers.mockReturnValue([])

      render(
        <Dashboard sales={undefined} customers={mockCustomers} onBack={mockOnBack} />
      )

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })

    it('handles null customers prop defensively', () => {
      getRewardsPendingCount.mockReturnValue(0)
      getTopCustomers.mockReturnValue([])

      render(
        <Dashboard sales={mockSales} customers={null} onBack={mockOnBack} />
      )

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })

    it('handles undefined customers prop defensively', () => {
      getRewardsPendingCount.mockReturnValue(0)
      getTopCustomers.mockReturnValue([])

      render(
        <Dashboard sales={mockSales} customers={undefined} onBack={mockOnBack} />
      )

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })
  })

  describe('Section structure', () => {
    it('renders Today section', () => {
      render(
        <Dashboard sales={mockSales} customers={mockCustomers} onBack={mockOnBack} />
      )

      expect(screen.getByText('Today')).toBeInTheDocument()
    })

    it('renders This Month section', () => {
      render(
        <Dashboard sales={mockSales} customers={mockCustomers} onBack={mockOnBack} />
      )

      expect(screen.getByText('This Month')).toBeInTheDocument()
    })

    it('renders Customers section', () => {
      render(
        <Dashboard sales={mockSales} customers={mockCustomers} onBack={mockOnBack} />
      )

      expect(screen.getByText('Customers')).toBeInTheDocument()
    })
  })
})
