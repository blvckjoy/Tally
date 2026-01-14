import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CustomerDetail from './CustomerDetail'

describe('CustomerDetail', () => {
  const mockCustomer = {
    id: 'customer_123',
    name: 'John Doe',
    phone: '0801234567',
    notes: 'Regular customer',
    dateAdded: '2024-01-15T10:00:00.000Z',
  }

  const mockHandlers = {
    onRecordSale: vi.fn(),
    onEdit: vi.fn(),
    onBack: vi.fn(),
  }

  it('should render customer information', () => {
    render(<CustomerDetail customer={mockCustomer} sales={[]} {...mockHandlers} />)

    expect(screen.getByText('Customer Details')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('0801234567')).toBeInTheDocument()
    expect(screen.getByText('Regular customer')).toBeInTheDocument()
  })

  it('should render customer without phone number', () => {
    const customerWithoutPhone = { ...mockCustomer, phone: '' }
    render(<CustomerDetail customer={customerWithoutPhone} sales={[]} {...mockHandlers} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.queryByText('Phone:')).not.toBeInTheDocument()
  })

  it('should render customer without notes', () => {
    const customerWithoutNotes = { ...mockCustomer, notes: '' }
    render(<CustomerDetail customer={customerWithoutNotes} sales={[]} {...mockHandlers} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.queryByText('Notes:')).not.toBeInTheDocument()
  })

  it('should call onRecordSale when Record Sale button is clicked', async () => {
    const user = userEvent.setup()
    render(<CustomerDetail customer={mockCustomer} sales={[]} {...mockHandlers} />)

    const recordSaleButton = screen.getByRole('button', { name: /record sale/i })
    await user.click(recordSaleButton)

    expect(mockHandlers.onRecordSale).toHaveBeenCalledWith('customer_123')
  })

  it('should call onEdit when Edit button is clicked', async () => {
    const user = userEvent.setup()
    render(<CustomerDetail customer={mockCustomer} sales={[]} {...mockHandlers} />)

    const editButton = screen.getByRole('button', { name: /edit/i })
    await user.click(editButton)

    expect(mockHandlers.onEdit).toHaveBeenCalledWith('customer_123')
  })

  it('should call onBack when Back button is clicked', async () => {
    const user = userEvent.setup()
    render(<CustomerDetail customer={mockCustomer} sales={[]} {...mockHandlers} />)

    const backButton = screen.getByRole('button', { name: /back/i })
    await user.click(backButton)

    expect(mockHandlers.onBack).toHaveBeenCalled()
  })

  it('should display success message when provided', () => {
    render(
      <CustomerDetail
        customer={mockCustomer}
        sales={[]}
        {...mockHandlers}
        successMessage="Sale recorded: ₦5,000"
      />
    )

    expect(screen.getByText('Sale recorded: ₦5,000')).toBeInTheDocument()
  })

  it('should show error state when customer is null', () => {
    render(<CustomerDetail customer={null} sales={[]} {...mockHandlers} />)

    expect(screen.getByText('Customer not found')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /back to list/i })).toBeInTheDocument()
  })

  it('should format date correctly', () => {
    render(<CustomerDetail customer={mockCustomer} sales={[]} {...mockHandlers} />)

    const dateValue = screen.getByText(/1\/15\/2024/i)
    expect(dateValue).toBeInTheDocument()
  })

  it('should display total loyalty points', () => {
    const sales = [
      {
        id: 'sale_1',
        customerId: 'customer_123',
        amount: 15000,
        pointsEarned: 15,
        createdAt: '2024-01-15T10:00:00.000Z',
      },
      {
        id: 'sale_2',
        customerId: 'customer_123',
        amount: 8000,
        pointsEarned: 8,
        createdAt: '2024-01-16T10:00:00.000Z',
      },
    ]

    render(<CustomerDetail customer={mockCustomer} sales={sales} {...mockHandlers} />)

    expect(screen.getByText(/23 points/i)).toBeInTheDocument()
  })

  it('should show reward indicator when customer has 50 or more points', () => {
    const sales = [
      {
        id: 'sale_1',
        customerId: 'customer_123',
        amount: 50000,
        pointsEarned: 50,
        createdAt: '2024-01-15T10:00:00.000Z',
      },
    ]

    render(<CustomerDetail customer={mockCustomer} sales={sales} {...mockHandlers} />)

    expect(screen.getByText(/reward available/i)).toBeInTheDocument()
  })

  it('should not show reward indicator when customer has less than 50 points', () => {
    const sales = [
      {
        id: 'sale_1',
        customerId: 'customer_123',
        amount: 49000,
        pointsEarned: 49,
        createdAt: '2024-01-15T10:00:00.000Z',
      },
    ]

    render(<CustomerDetail customer={mockCustomer} sales={sales} {...mockHandlers} />)

    expect(screen.queryByText(/reward available/i)).not.toBeInTheDocument()
  })

  it('should display sales history with amounts and points', () => {
    const sales = [
      {
        id: 'sale_1',
        customerId: 'customer_123',
        amount: 5000,
        pointsEarned: 5,
        createdAt: '2024-01-15T10:00:00.000Z',
      },
      {
        id: 'sale_2',
        customerId: 'customer_123',
        amount: 7500,
        pointsEarned: 7,
        createdAt: '2024-01-16T10:00:00.000Z',
      },
    ]

    render(<CustomerDetail customer={mockCustomer} sales={sales} {...mockHandlers} />)

    expect(screen.getByText(/₦5,000/i)).toBeInTheDocument()
    expect(screen.getByText(/₦7,500/i)).toBeInTheDocument()
    expect(screen.getByText(/5 points earned/i)).toBeInTheDocument()
    expect(screen.getByText(/7 points earned/i)).toBeInTheDocument()
  })

  it('should show empty state when customer has no sales', () => {
    render(<CustomerDetail customer={mockCustomer} sales={[]} {...mockHandlers} />)

    expect(screen.getByText(/no sales yet/i)).toBeInTheDocument()
  })

  it('should display sale description in history when present', () => {
    const sales = [
      {
        id: 'sale_1',
        customerId: 'customer_123',
        amount: 5000,
        pointsEarned: 5,
        description: 'Shoes and accessories',
        createdAt: '2024-01-15T10:00:00.000Z',
      },
    ]

    render(<CustomerDetail customer={mockCustomer} sales={sales} {...mockHandlers} />)

    expect(screen.getByText('Shoes and accessories')).toBeInTheDocument()
  })

  it('should not display description when empty', () => {
    const sales = [
      {
        id: 'sale_1',
        customerId: 'customer_123',
        amount: 5000,
        pointsEarned: 5,
        description: '',
        createdAt: '2024-01-15T10:00:00.000Z',
      },
    ]

    render(<CustomerDetail customer={mockCustomer} sales={sales} {...mockHandlers} />)

    // Should not find any .sale-description element with content
    const saleDescriptions = document.querySelectorAll('.sale-description')
    saleDescriptions.forEach(desc => {
      expect(desc.textContent).toBe('')
    })
  })
})
