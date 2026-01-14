import { useState, useEffect } from 'react'

function CustomerForm({ customer, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    notes: '',
  })

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        phone: customer.phone || '',
        notes: customer.notes || '',
      })
    }
  }, [customer])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      return
    }

    onSubmit({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      notes: formData.notes.trim(),
    })
  }

  const isEditMode = !!customer

  return (
    <form className="customer-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name *</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Customer name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone number"
        />
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional notes"
          rows="3"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {isEditMode ? 'Save' : 'Add Customer'}
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
  )
}

export default CustomerForm
