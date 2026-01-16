import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

// Mock all child components to isolate App logic
vi.mock('./components/CustomerList', () => ({
  default: ({ customers, sales, onEdit, onDelete }) => (
    <div data-testid="customer-list">
      CustomerList Mock
      <button onClick={() => onEdit('1')}>Edit Customer</button>
    </div>
  ),
}))

vi.mock('./components/CustomerForm', () => ({
  default: ({ customer, onSubmit, onCancel }) => (
    <div data-testid="customer-form">
      CustomerForm Mock
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}))

vi.mock('./components/CustomerDetail', () => ({
  default: ({ customer, sales, onRecordSale, onEdit, onBack, successMessage }) => (
    <div data-testid="customer-detail">
      CustomerDetail Mock
      <button onClick={onBack}>Back</button>
    </div>
  ),
}))

vi.mock('./components/SaleForm', () => ({
  default: ({ customer, onSubmit, onCancel }) => (
    <div data-testid="sale-form">
      SaleForm Mock
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}))

vi.mock('./components/Dashboard', () => ({
  default: ({ sales, customers, onBack }) => (
    <div data-testid="dashboard">
      Dashboard Mock
      <button onClick={onBack}>Back to Customers</button>
    </div>
  ),
}))

// Mock storage utilities
vi.mock('./utils/customerStorage', () => ({
  addCustomer: vi.fn(),
  getCustomers: vi.fn(() => [
    { id: '1', name: 'Test Customer', phone: '555-1234', notes: '', dateAdded: '2024-01-15T10:00:00Z' },
  ]),
  updateCustomer: vi.fn(),
  deleteCustomer: vi.fn(),
}))

vi.mock('./utils/saleStorage', () => ({
  addSale: vi.fn(() => ({ id: 'sale_1', amount: 5000 })),
  getSales: vi.fn(() => [
    { id: 'sale_1', customerId: '1', amount: 5000, pointsEarned: 5, createdAt: '2024-01-16T10:00:00Z' },
  ]),
}))

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Dashboard navigation', () => {
    it('shows dashboard button on customer list', () => {
      render(<App />)

      const dashboardButton = screen.getByRole('button', { name: /view dashboard/i })
      expect(dashboardButton).toBeInTheDocument()
    })

    it('navigates to dashboard when dashboard button clicked', async () => {
      const user = userEvent.setup()
      render(<App />)

      // Click the dashboard button
      const dashboardButton = screen.getByRole('button', { name: /view dashboard/i })
      await user.click(dashboardButton)

      // Should now show the Dashboard component
      expect(screen.getByTestId('dashboard')).toBeInTheDocument()
      // Should not show customer list
      expect(screen.queryByTestId('customer-list')).not.toBeInTheDocument()
    })

    it('returns to customer list from dashboard', async () => {
      const user = userEvent.setup()
      render(<App />)

      // Navigate to dashboard
      const dashboardButton = screen.getByRole('button', { name: /view dashboard/i })
      await user.click(dashboardButton)

      // Click back button in Dashboard
      const backButton = screen.getByRole('button', { name: /back to customers/i })
      await user.click(backButton)

      // Should now show customer list
      expect(screen.getByTestId('customer-list')).toBeInTheDocument()
      // Should not show dashboard
      expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument()
    })
  })
})
