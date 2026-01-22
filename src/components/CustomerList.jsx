import { useState } from 'react'
import { getCustomerTotalPoints, isRewardAvailable } from '../utils/loyaltyCalculator'
import ConfirmationModal from './ConfirmationModal'

function CustomerList({ customers, onEdit, onDelete, sales }) {
  const [modalState, setModalState] = useState({ isOpen: false, customerId: null, customerName: '' })

  if (customers.length === 0) {
    return (
      <div className="customer-list">
        <p className="empty-state">No customers yet. Add one to get started.</p>
      </div>
    )
  }

  const handleDeleteClick = (id, name) => {
    setModalState({ isOpen: true, customerId: id, customerName: name })
  }

  const handleConfirmDelete = () => {
    onDelete(modalState.customerId)
    setModalState({ isOpen: false, customerId: null, customerName: '' })
  }

  const handleCloseModal = () => {
    setModalState({ isOpen: false, customerId: null, customerName: '' })
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
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteClick(customer.id, customer.name)}
                >
                  Delete
                </button>
              </div>
            </div>
          )
        })}
      </div>
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Delete customer?"
        message="This will remove the customer, but past sales will remain."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
      />
    </div>
  )
}

export default CustomerList
