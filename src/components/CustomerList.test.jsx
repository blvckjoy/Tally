import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CustomerList from './CustomerList'

describe('CustomerList', () => {
  const mockCustomers = [
    {
      id: '1',
      name: 'Alice Johnson',
      phone: '555-1234',
      notes: 'Preferred customer',
      dateAdded: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      name: 'Bob Smith',
      phone: '555-5678',
      notes: '',
      dateAdded: '2024-01-20T14:30:00Z',
    },
  ]

  it('should display all customers in a list', () => {
    const mockOnEdit = vi.fn()
    const mockOnDelete = vi.fn()

    render(
      <CustomerList
        customers={mockCustomers}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        sales={[]}
      />
    )

    expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    expect(screen.getByText('Bob Smith')).toBeInTheDocument()
  })

  it('should display customer phone numbers', () => {
    const mockOnEdit = vi.fn()
    const mockOnDelete = vi.fn()

    render(
      <CustomerList
        customers={mockCustomers}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        sales={[]}
      />
    )

    expect(screen.getByText('555-1234')).toBeInTheDocument()
    expect(screen.getByText('555-5678')).toBeInTheDocument()
  })

  it('should display customer added dates formatted', () => {
    const mockOnEdit = vi.fn()
    const mockOnDelete = vi.fn()

    render(
      <CustomerList
        customers={mockCustomers}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        sales={[]}
      />
    )

    const dateText = screen.getByText(/Jan 15, 2024/)
    expect(dateText).toBeInTheDocument()
  })

  it('should make customer info clickable', () => {
    const mockOnEdit = vi.fn()
    const mockOnDelete = vi.fn()

    render(
      <CustomerList
        customers={mockCustomers}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        sales={[]}
      />
    )

    const customerNames = screen.getAllByText(/Alice Johnson|Bob Smith/)
    customerNames.forEach(name => {
      expect(name.parentElement).toHaveStyle('cursor: pointer')
    })
  })

  it('should show delete button for each customer', () => {
    const mockOnEdit = vi.fn()
    const mockOnDelete = vi.fn()

    render(
      <CustomerList
        customers={mockCustomers}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        sales={[]}
      />
    )

    const deleteButtons = screen.getAllByText('Delete')
    expect(deleteButtons).toHaveLength(2)
  })

  it('should call onEdit with customer id when customer info clicked', async () => {
    const user = userEvent.setup()
    const mockOnEdit = vi.fn()
    const mockOnDelete = vi.fn()

    render(
      <CustomerList
        customers={mockCustomers}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        sales={[]}
      />
    )

    const customerName = screen.getByText('Alice Johnson')
    await user.click(customerName)

    expect(mockOnEdit).toHaveBeenCalledWith('1')
  })

  it('should show confirmation modal when delete button clicked', async () => {
    const user = userEvent.setup()
    const mockOnEdit = vi.fn()
    const mockOnDelete = vi.fn()

    render(
      <CustomerList
        customers={mockCustomers}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        sales={[]}
      />
    )

    const deleteButtons = screen.getAllByText('Delete')
    await user.click(deleteButtons[0])

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Delete customer?')).toBeInTheDocument()
    expect(screen.getByText('This will remove the customer, but past sales will remain.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('should call onDelete when confirm delete is clicked in modal', async () => {
    const user = userEvent.setup()
    const mockOnEdit = vi.fn()
    const mockOnDelete = vi.fn()

    render(
      <CustomerList
        customers={mockCustomers}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        sales={[]}
      />
    )

    // Click first delete button to show modal
    const deleteButtons = screen.getAllByText('Delete')
    await user.click(deleteButtons[0])

    // Now click the confirm delete button inside modal
    const modal = screen.getByRole('dialog')
    const confirmButton = modal.querySelector('.btn-danger')
    await user.click(confirmButton)

    expect(mockOnDelete).toHaveBeenCalledWith('1')
  })

  it('should not call onDelete if cancel is clicked in modal', async () => {
    const user = userEvent.setup()
    const mockOnEdit = vi.fn()
    const mockOnDelete = vi.fn()

    render(
      <CustomerList
        customers={mockCustomers}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        sales={[]}
      />
    )

    const deleteButtons = screen.getAllByText('Delete')
    await user.click(deleteButtons[0])

    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    await user.click(cancelButton)

    expect(mockOnDelete).not.toHaveBeenCalled()
  })

  it('should hide modal after cancel is clicked', async () => {
    const user = userEvent.setup()
    const mockOnEdit = vi.fn()
    const mockOnDelete = vi.fn()

    render(
      <CustomerList
        customers={mockCustomers}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        sales={[]}
      />
    )

    const deleteButtons = screen.getAllByText('Delete')
    await user.click(deleteButtons[0])

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Delete customer?')).toBeInTheDocument()

    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    await user.click(cancelButton)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByText('Delete customer?')).not.toBeInTheDocument()
  })

  it('should show empty state when no customers', () => {
    const mockOnEdit = vi.fn()
    const mockOnDelete = vi.fn()

    render(
      <CustomerList
        customers={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        sales={[]}
      />
    )

    expect(
      screen.getByText(/No customers yet/)
    ).toBeInTheDocument()
  })

  it('should be responsive on mobile', () => {
    const mockOnEdit = vi.fn()
    const mockOnDelete = vi.fn()

    const { container } = render(
      <CustomerList
        customers={mockCustomers}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        sales={[]}
      />
    )

    const listContainer = container.firstChild
    expect(listContainer).toHaveClass('customer-list')
  })

  it('should display loyalty points for each customer', () => {
    const mockOnEdit = vi.fn()
    const mockOnDelete = vi.fn()
    const mockSales = [
      { id: '1', customerId: '1', pointsEarned: 10, createdAt: '2024-01-16' },
      { id: '2', customerId: '1', pointsEarned: 5, createdAt: '2024-01-17' },
      { id: '3', customerId: '2', pointsEarned: 7, createdAt: '2024-01-21' },
    ]

    render(
      <CustomerList
        customers={mockCustomers}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        sales={mockSales}
      />
    )

    expect(screen.getByText('15 points')).toBeInTheDocument()
    expect(screen.getByText('7 points')).toBeInTheDocument()
  })

  it('should show reward badge when customer has 50 or more points', () => {
    const mockOnEdit = vi.fn()
    const mockOnDelete = vi.fn()
    const mockSales = [
      { id: '1', customerId: '1', pointsEarned: 50, createdAt: '2024-01-16' },
    ]

    render(
      <CustomerList
        customers={[mockCustomers[0]]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        sales={mockSales}
      />
    )

    expect(screen.getByText('Reward Available')).toBeInTheDocument()
  })

  it('should not show reward badge when customer has less than 50 points', () => {
    const mockOnEdit = vi.fn()
    const mockOnDelete = vi.fn()
    const mockSales = [
      { id: '1', customerId: '1', pointsEarned: 49, createdAt: '2024-01-16' },
    ]

    render(
      <CustomerList
        customers={[mockCustomers[0]]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        sales={mockSales}
      />
    )

    expect(screen.queryByText('Reward Available')).not.toBeInTheDocument()
  })
})
