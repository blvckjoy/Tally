import { useState } from 'react'

function SaleForm({ customer, onSubmit, onCancel }) {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Validate amount
    if (!amount || amount.trim() === '') {
      setError('Amount is required')
      return
    }

    const numericAmount = parseFloat(amount)
    if (isNaN(numericAmount)) {
      setError('Please enter a valid number')
      return
    }

    if (numericAmount <= 0) {
      setError('Amount must be greater than zero')
      return
    }

    onSubmit({
      amount: numericAmount,
      customerId: customer.id,
      description: description.trim(),
    })
  }

  return (
    <div className="form-container">
      <h2>Record Sale for {customer.name}</h2>

      <form className="customer-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Amount (₦) *</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            autoFocus
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (optional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Shoes, Groceries, Service..."
            rows="2"
          />
        </div>

        <div className="form-group">
          <label>Customer</label>
          <div className="readonly-field">
            {customer.name}
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Save Sale
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default SaleForm
