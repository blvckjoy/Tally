import { getCustomerTotalPoints, isRewardAvailable, getCustomerSales } from '../utils/loyaltyCalculator'

function CustomerDetail({ customer, onRecordSale, onEdit, onBack, successMessage, sales = [] }) {
  if (!customer) {
    return (
      <div className="customer-detail">
        <div className="error-message">Customer not found</div>
        <button className="btn btn-secondary" onClick={onBack}>
          Back to List
        </button>
      </div>
    )
  }

  const totalPoints = getCustomerTotalPoints(customer.id, sales)
  const rewardAvailable = isRewardAvailable(totalPoints)
  const customerSales = getCustomerSales(customer.id, sales)

  return (
    <div className="customer-detail">
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      <div className="detail-header">
        <h2>Customer Details</h2>
      </div>

      <div className="detail-content">
        <div className="detail-row">
          <span className="detail-label">Name:</span>
          <span className="detail-value">{customer.name}</span>
        </div>

        {customer.phone && (
          <div className="detail-row">
            <span className="detail-label">Phone:</span>
            <span className="detail-value">{customer.phone}</span>
          </div>
        )}

        {customer.notes && (
          <div className="detail-row">
            <span className="detail-label">Notes:</span>
            <span className="detail-value">{customer.notes}</span>
          </div>
        )}

        <div className="detail-row">
          <span className="detail-label">Date Added:</span>
          <span className="detail-value">
            {new Date(customer.dateAdded).toLocaleDateString()}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Loyalty Points:</span>
          <span className="detail-value">
            {totalPoints} points
            {rewardAvailable && <span className="reward-indicator"> • Reward Available</span>}
          </span>
        </div>
      </div>

      <div className="detail-actions">
        <button
          className="btn btn-primary"
          onClick={() => onRecordSale(customer.id)}
        >
          Record Sale
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => onEdit(customer.id)}
        >
          Edit
        </button>
        <button
          className="btn btn-secondary"
          onClick={onBack}
        >
          Back
        </button>
      </div>

      <div className="sales-history">
        <h3>Sales History</h3>
        {customerSales.length === 0 ? (
          <p>No sales yet. Record the first sale to start tracking loyalty.</p>
        ) : (
          <div className="sales-list">
            {customerSales.map((sale) => (
              <div key={sale.id} className="sale-item">
                <div className="sale-info">
                  <div className="sale-amount">
                    ₦{sale.amount.toLocaleString()}
                  </div>
                  <div className="sale-date">
                    {new Date(sale.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  {sale.description && (
                    <div className="sale-description">{sale.description}</div>
                  )}
                </div>
                <div className="sale-points">
                  {sale.pointsEarned} points earned
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerDetail
