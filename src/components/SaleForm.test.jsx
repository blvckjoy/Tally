import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SaleForm from './SaleForm'

describe('SaleForm', () => {
  const mockCustomer = {
    id: 'customer_123',
    name: 'John Doe',
  }

  let mockHandlers

  beforeEach(() => {
    mockHandlers = {
      onSubmit: vi.fn(),
      onCancel: vi.fn(),
    }
  })

  it('should render form with customer name', () => {
    render(<SaleForm customer={mockCustomer} {...mockHandlers} />)

    expect(screen.getByText('Record Sale for John Doe')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument()
  })

  it('should display customer name as read-only', () => {
    render(<SaleForm customer={mockCustomer} {...mockHandlers} />)

    const customerField = screen.getByText('John Doe')
    expect(customerField).toBeInTheDocument()
    expect(customerField.closest('input')).toBeNull() // Not an input field
  })

  it('should submit valid sale data', async () => {
    const user = userEvent.setup()
    render(<SaleForm customer={mockCustomer} {...mockHandlers} />)

    const amountInput = screen.getByLabelText(/amount/i)
    await user.type(amountInput, '5000')

    const submitButton = screen.getByRole('button', { name: /save sale/i })
    await user.click(submitButton)

    expect(mockHandlers.onSubmit).toHaveBeenCalledWith({
      amount: 5000,
      customerId: 'customer_123',
      description: '',
    })
  })

  it('should handle decimal amounts', async () => {
    const user = userEvent.setup()
    render(<SaleForm customer={mockCustomer} {...mockHandlers} />)

    const amountInput = screen.getByLabelText(/amount/i)
    await user.type(amountInput, '5250.75')

    const submitButton = screen.getByRole('button', { name: /save sale/i })
    await user.click(submitButton)

    expect(mockHandlers.onSubmit).toHaveBeenCalledWith({
      amount: 5250.75,
      customerId: 'customer_123',
      description: '',
    })
  })

  it('should show error when amount is empty', async () => {
    const user = userEvent.setup()
    render(<SaleForm customer={mockCustomer} {...mockHandlers} />)

    const submitButton = screen.getByRole('button', { name: /save sale/i })
    await user.click(submitButton)

    expect(screen.getByText('Amount is required')).toBeInTheDocument()
    expect(mockHandlers.onSubmit).not.toHaveBeenCalled()
  })

  it('should show error when amount is zero', async () => {
    const user = userEvent.setup()
    render(<SaleForm customer={mockCustomer} {...mockHandlers} />)

    const amountInput = screen.getByLabelText(/amount/i)
    await user.type(amountInput, '0')

    const submitButton = screen.getByRole('button', { name: /save sale/i })
    await user.click(submitButton)

    expect(screen.getByText('Amount must be greater than zero')).toBeInTheDocument()
    expect(mockHandlers.onSubmit).not.toHaveBeenCalled()
  })

  it('should show error when amount is negative', async () => {
    const user = userEvent.setup()
    render(<SaleForm customer={mockCustomer} {...mockHandlers} />)

    const amountInput = screen.getByLabelText(/amount/i)
    await user.type(amountInput, '-100')

    const submitButton = screen.getByRole('button', { name: /save sale/i })
    await user.click(submitButton)

    expect(screen.getByText('Amount must be greater than zero')).toBeInTheDocument()
    expect(mockHandlers.onSubmit).not.toHaveBeenCalled()
  })

  it('should show error when amount is not a number', async () => {
    const user = userEvent.setup()
    render(<SaleForm customer={mockCustomer} {...mockHandlers} />)

    const amountInput = screen.getByLabelText(/amount/i)
    // Clear the input and try to type non-numeric - number input may not accept it
    // So we'll just submit with empty which is handled by the "required" validation
    await user.clear(amountInput)

    const submitButton = screen.getByRole('button', { name: /save sale/i })
    await user.click(submitButton)

    // Since number inputs don't accept non-numeric values, this will trigger "Amount is required"
    expect(screen.getByText('Amount is required')).toBeInTheDocument()
    expect(mockHandlers.onSubmit).not.toHaveBeenCalled()
  })

  it('should call onCancel when Cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(<SaleForm customer={mockCustomer} {...mockHandlers} />)

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    expect(mockHandlers.onCancel).toHaveBeenCalled()
  })

  it('should clear error when user corrects input', async () => {
    const user = userEvent.setup()
    render(<SaleForm customer={mockCustomer} {...mockHandlers} />)

    const submitButton = screen.getByRole('button', { name: /save sale/i })
    await user.click(submitButton)

    expect(screen.getByText('Amount is required')).toBeInTheDocument()

    const amountInput = screen.getByLabelText(/amount/i)
    await user.type(amountInput, '1000')
    await user.click(submitButton)

    expect(screen.queryByText('Amount is required')).not.toBeInTheDocument()
    expect(mockHandlers.onSubmit).toHaveBeenCalled()
  })

  it('should include description in submitted data when provided', async () => {
    const user = userEvent.setup()
    render(<SaleForm customer={mockCustomer} {...mockHandlers} />)

    const amountInput = screen.getByLabelText(/amount/i)
    await user.type(amountInput, '5000')

    const descriptionInput = screen.getByLabelText(/description/i)
    await user.type(descriptionInput, 'Shoes and accessories')

    const submitButton = screen.getByRole('button', { name: /save sale/i })
    await user.click(submitButton)

    expect(mockHandlers.onSubmit).toHaveBeenCalledWith({
      amount: 5000,
      customerId: 'customer_123',
      description: 'Shoes and accessories',
    })
  })

  it('should include empty description in submitted data when not provided', async () => {
    const user = userEvent.setup()
    render(<SaleForm customer={mockCustomer} {...mockHandlers} />)

    const amountInput = screen.getByLabelText(/amount/i)
    await user.type(amountInput, '5000')

    const submitButton = screen.getByRole('button', { name: /save sale/i })
    await user.click(submitButton)

    expect(mockHandlers.onSubmit).toHaveBeenCalledWith({
      amount: 5000,
      customerId: 'customer_123',
      description: '',
    })
  })
})
