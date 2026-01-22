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
  default: ({ sales, customers }) => (
    <div data-testid="dashboard">
      Dashboard Mock
    </div>
  ),
}))

vi.mock('./components/Settings', () => ({
  default: () => (
    <div data-testid="settings">
      Settings Mock
    </div>
  ),
}))

vi.mock('./components/BottomNav', () => ({
  default: ({ currentView, onNavigate }) => (
    <nav data-testid="bottom-nav">
      <button onClick={() => onNavigate('list')}>Nav Customers</button>
      <button onClick={() => onNavigate('dashboard')}>Nav Dashboard</button>
      <button onClick={() => onNavigate('settings')}>Nav Settings</button>
    </nav>
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

  describe('Header navigation', () => {
    it('shows header navigation with all tabs', () => {
      render(<App />)

      expect(screen.getByRole('button', { name: 'Customers' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Dashboard' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument()
    })

    it('navigates to dashboard via header nav', async () => {
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: 'Dashboard' }))

      expect(screen.getByTestId('dashboard')).toBeInTheDocument()
      expect(screen.queryByTestId('customer-list')).not.toBeInTheDocument()
    })

    it('navigates to customers via header nav', async () => {
      const user = userEvent.setup()
      render(<App />)

      // Navigate to dashboard first
      await user.click(screen.getByRole('button', { name: 'Dashboard' }))

      // Then back to customers
      await user.click(screen.getByRole('button', { name: 'Customers' }))

      expect(screen.getByTestId('customer-list')).toBeInTheDocument()
      expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument()
    })

    it('navigates to settings via header nav', async () => {
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: 'Settings' }))

      expect(screen.getByTestId('settings')).toBeInTheDocument()
      expect(screen.queryByTestId('customer-list')).not.toBeInTheDocument()
    })
  })

  describe('Bottom navigation integration', () => {
    it('renders bottom navigation', () => {
      render(<App />)
      expect(screen.getByTestId('bottom-nav')).toBeInTheDocument()
    })

    it('navigates to settings via bottom nav', async () => {
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: 'Nav Settings' }))
      expect(screen.getByTestId('settings')).toBeInTheDocument()
    })

    it('navigates to dashboard via bottom nav', async () => {
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: 'Nav Dashboard' }))
      expect(screen.getByTestId('dashboard')).toBeInTheDocument()
    })

    it('navigates back to customers via bottom nav', async () => {
      const user = userEvent.setup()
      render(<App />)

      // Go to settings first
      await user.click(screen.getByRole('button', { name: 'Nav Settings' }))
      expect(screen.getByTestId('settings')).toBeInTheDocument()

      // Then back to customers
      await user.click(screen.getByRole('button', { name: 'Nav Customers' }))
      expect(screen.getByTestId('customer-list')).toBeInTheDocument()
    })
  })
})
