import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConfirmationModal from './ConfirmationModal'

describe('ConfirmationModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: 'Delete customer?',
    message: 'This will remove the customer, but past sales will remain.',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
    variant: 'danger',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('should render modal with correct title and message when open', () => {
    render(<ConfirmationModal {...defaultProps} />)

    expect(screen.getByText('Delete customer?')).toBeInTheDocument()
    expect(screen.getByText('This will remove the customer, but past sales will remain.')).toBeInTheDocument()
  })

  it('should not render when isOpen is false', () => {
    render(<ConfirmationModal {...defaultProps} isOpen={false} />)

    expect(screen.queryByText('Delete customer?')).not.toBeInTheDocument()
  })

  it('should render custom button labels', () => {
    render(<ConfirmationModal {...defaultProps} />)

    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('should call onClose when Cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(<ConfirmationModal {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('should call onConfirm and onClose when Confirm button is clicked', async () => {
    const user = userEvent.setup()
    render(<ConfirmationModal {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: 'Delete' }))

    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1)
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('should apply danger variant class to confirm button', () => {
    render(<ConfirmationModal {...defaultProps} variant="danger" />)

    const confirmButton = screen.getByRole('button', { name: 'Delete' })
    expect(confirmButton).toHaveClass('btn-danger')
  })

  it('should apply primary variant class when variant is not danger', () => {
    render(<ConfirmationModal {...defaultProps} variant="info" />)

    const confirmButton = screen.getByRole('button', { name: 'Delete' })
    expect(confirmButton).toHaveClass('btn-primary')
  })

  it('should have proper ARIA attributes', () => {
    render(<ConfirmationModal {...defaultProps} />)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title')

    const title = screen.getByText('Delete customer?')
    expect(title).toHaveAttribute('id', 'modal-title')
  })

  it('should lock body scroll when modal is open', () => {
    render(<ConfirmationModal {...defaultProps} isOpen={true} />)

    expect(document.body.style.overflow).toBe('hidden')
  })

  it('should restore body scroll when modal is closed', () => {
    const { rerender } = render(<ConfirmationModal {...defaultProps} isOpen={true} />)

    expect(document.body.style.overflow).toBe('hidden')

    rerender(<ConfirmationModal {...defaultProps} isOpen={false} />)

    expect(document.body.style.overflow).toBe('')
  })

  it('should focus Cancel button when modal opens', () => {
    render(<ConfirmationModal {...defaultProps} />)

    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    expect(cancelButton).toHaveFocus()
  })

  it('should use default labels when not provided', () => {
    const propsWithoutLabels = {
      ...defaultProps,
      confirmLabel: undefined,
      cancelLabel: undefined,
    }
    render(<ConfirmationModal {...propsWithoutLabels} />)

    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('should trap focus within modal', async () => {
    const user = userEvent.setup()
    render(<ConfirmationModal {...defaultProps} />)

    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    const confirmButton = screen.getByRole('button', { name: 'Delete' })

    expect(cancelButton).toHaveFocus()

    await user.tab()
    expect(confirmButton).toHaveFocus()

    await user.tab()
    expect(cancelButton).toHaveFocus()
  })
})
