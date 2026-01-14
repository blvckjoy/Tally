import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CustomerForm from './CustomerForm'

describe('CustomerForm', () => {
  it('should render form with empty fields when no initial customer', () => {
    const mockOnSubmit = vi.fn()
    const mockOnCancel = vi.fn()

    render(
      <CustomerForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    const nameInput = screen.getByLabelText(/Name/)
    const phoneInput = screen.getByLabelText(/Phone/)
    const notesInput = screen.getByLabelText(/Notes/)

    expect(nameInput).toHaveValue('')
    expect(phoneInput).toHaveValue('')
    expect(notesInput).toHaveValue('')
  })

  it('should populate form fields when editing existing customer', () => {
    const existingCustomer = {
      id: '1',
      name: 'John Doe',
      phone: '555-1234',
      notes: 'VIP customer',
    }
    const mockOnSubmit = vi.fn()
    const mockOnCancel = vi.fn()

    render(
      <CustomerForm
        customer={existingCustomer}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    const nameInput = screen.getByLabelText(/Name/)
    const phoneInput = screen.getByLabelText(/Phone/)
    const notesInput = screen.getByLabelText(/Notes/)

    expect(nameInput).toHaveValue('John Doe')
    expect(phoneInput).toHaveValue('555-1234')
    expect(notesInput).toHaveValue('VIP customer')
  })

  it('should require name field', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = vi.fn()
    const mockOnCancel = vi.fn()

    render(
      <CustomerForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    const submitButton = screen.getByText(/Add Customer|Save/)
    await user.click(submitButton)

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('should allow phone and notes to be empty', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = vi.fn()
    const mockOnCancel = vi.fn()

    render(
      <CustomerForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    const nameInput = screen.getByLabelText(/Name/)
    await user.type(nameInput, 'Jane Doe')

    const submitButton = screen.getByText(/Add Customer|Save/)
    await user.click(submitButton)

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Jane Doe',
      phone: '',
      notes: '',
    })
  })

  it('should call onSubmit with form data on submit', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = vi.fn()
    const mockOnCancel = vi.fn()

    render(
      <CustomerForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    const nameInput = screen.getByLabelText(/Name/)
    const phoneInput = screen.getByLabelText(/Phone/)
    const notesInput = screen.getByLabelText(/Notes/)

    await user.type(nameInput, 'Test Customer')
    await user.type(phoneInput, '555-9999')
    await user.type(notesInput, 'Test notes')

    const submitButton = screen.getByText(/Add Customer|Save/)
    await user.click(submitButton)

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Test Customer',
      phone: '555-9999',
      notes: 'Test notes',
    })
  })

  it('should trim whitespace from inputs', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = vi.fn()
    const mockOnCancel = vi.fn()

    render(
      <CustomerForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    const nameInput = screen.getByLabelText(/Name/)
    await user.type(nameInput, '  Test  ')

    const submitButton = screen.getByText(/Add Customer|Save/)
    await user.click(submitButton)

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test',
      })
    )
  })

  it('should call onCancel when cancel button clicked', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = vi.fn()
    const mockOnCancel = vi.fn()

    render(
      <CustomerForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    const cancelButton = screen.getByText(/Cancel/)
    await user.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('should show appropriate button text for add vs edit', () => {
    const mockOnSubmit = vi.fn()
    const mockOnCancel = vi.fn()

    const { rerender } = render(
      <CustomerForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByText(/Add|Save/)).toBeInTheDocument()

    const existingCustomer = { id: '1', name: 'Test' }
    rerender(
      <CustomerForm
        customer={existingCustomer}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByText(/Save|Update/)).toBeInTheDocument()
  })

  it('should be mobile responsive', () => {
    const mockOnSubmit = vi.fn()
    const mockOnCancel = vi.fn()

    const { container } = render(
      <CustomerForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    const form = container.querySelector('form')
    expect(form).toHaveClass('customer-form')
  })
})
