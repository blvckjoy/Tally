import { useState } from 'react'
import { getCustomerTotalPoints, isRewardAvailable } from '../utils/loyaltyCalculator'

function CustomerList({ customers, onEdit, onDelete, sales }) {
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null)

  if (customers.length === 0) {
    return (
      <div className="customer-list">
        <p className="empty-state">No customers yet. Add one to get started.</p>
      </div>
    )
  }

  const handleDeleteClick = (id) => {
    setConfirmingDeleteId(id)
  }

  const handleConfirmDelete = (id) => {
    onDelete(id)
    setConfirmingDeleteId(null)
  }

  const handleCancelDelete = () => {
    setConfirmingDeleteId(null)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="customer-list">
      <div className="customer-items">
        {customers.map((customer) => {
          const totalPoints = getCustomerTotalPoints(customer.id, sales)
          const rewardAvailable = isRewardAvailable(totalPoints)

          return (
            <div key={customer.id} className="customer-item">
              <div
                className="customer-info"
                onClick={() => onEdit(customer.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="customer-name">
                  {customer.name}
                  {rewardAvailable && <span className="reward-badge">Reward Available</span>}
                </div>
                {customer.phone && (
                  <div className="customer-phone">{customer.phone}</div>
                )}
                <div className="customer-date">{formatDate(customer.dateAdded)}</div>
                <div className="customer-points">{totalPoints} points</div>
              </div>
              <div className="customer-actions">
                {confirmingDeleteId === customer.id ? (
                  <div className="delete-confirmation">
                    <div className="delete-confirmation-text">
                      <strong>Delete customer?</strong>
                      <span>This will remove the customer, but past sales will remain.</span>
                    </div>
                    <div className="delete-confirmation-buttons">
                      <button
                        className="btn btn-danger"
                        onClick={() => handleConfirmDelete(customer.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={handleCancelDelete}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteClick(customer.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CustomerList
