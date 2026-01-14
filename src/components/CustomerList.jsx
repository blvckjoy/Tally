import { getCustomerTotalPoints, isRewardAvailable } from '../utils/loyaltyCalculator'

function CustomerList({ customers, onEdit, onDelete, sales }) {
  if (customers.length === 0) {
    return (
      <div className="customer-list">
        <p className="empty-state">No customers yet. Add one to get started.</p>
      </div>
    )
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      onDelete(id)
    }
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
                  onClick={() => handleDelete(customer.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CustomerList
