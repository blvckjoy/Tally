import {
  getTodayRevenue,
  getTodayTransactions,
  getMonthlyRevenue,
  getMonthlyTransactions,
  getAverageSale,
  getRewardsPendingCount,
  getTopCustomers,
} from '../utils/dashboardCalculator'

function Dashboard({ sales, customers, onBack }) {
  // Handle null/undefined props defensively
  const safeSales = sales || []
  const safeCustomers = customers || []

  // Calculate all metrics using utilities
  const todayRevenue = getTodayRevenue(safeSales)
  const todayTransactions = getTodayTransactions(safeSales)
  const monthlyRevenue = getMonthlyRevenue(safeSales)
  const monthlyTransactions = getMonthlyTransactions(safeSales)
  const averageSale = getAverageSale(safeSales)
  const rewardsPending = getRewardsPendingCount(safeCustomers, safeSales)
  const topCustomers = getTopCustomers(safeCustomers, safeSales)

  // Format currency with Naira symbol and thousands separator
  const formatCurrency = (amount) => `₦${amount.toLocaleString()}`

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
      </div>

      {/* Today Section */}
      <div className="dashboard-section">
        <div className="section-title">Today</div>
        <div className="metric-row">
          <span className="metric-label">Revenue:</span>
          <span className="metric-value">{formatCurrency(todayRevenue)}</span>
        </div>
        <div className="metric-row">
          <span className="metric-label">Transactions:</span>
          <span className="metric-value">{todayTransactions}</span>
        </div>
      </div>

      {/* This Month Section */}
      <div className="dashboard-section">
        <div className="section-title">This Month</div>
        <div className="metric-row">
          <span className="metric-label">Revenue:</span>
          <span className="metric-value">{formatCurrency(monthlyRevenue)}</span>
        </div>
        <div className="metric-row">
          <span className="metric-label">Transactions:</span>
          <span className="metric-value">{monthlyTransactions}</span>
        </div>
        <div className="metric-row">
          <span className="metric-label">Average Sale:</span>
          <span className="metric-value">{formatCurrency(averageSale)}</span>
        </div>
      </div>

      {/* Customers Section */}
      <div className="dashboard-section">
        <div className="section-title">Customers</div>
        <div className="metric-row">
          <span className="metric-label">Total Customers:</span>
          <span className="metric-value">{safeCustomers.length}</span>
        </div>
        <div className="metric-row">
          <span className="metric-label">Rewards Pending:</span>
          <span className="metric-value">{rewardsPending}</span>
        </div>
      </div>

      {/* Top Customers Section */}
      <div className="dashboard-section">
        <div className="section-title">Top Customers</div>
        {topCustomers.length > 0 ? (
          <ol className="top-customers-list">
            {topCustomers.map(({ customer, totalPoints }, index) => (
              <li key={customer.id} className="top-customer-item">
                <span className="customer-name">{customer.name}</span>
                <span className="customer-points">{totalPoints} pts</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="empty-state">No customers with points yet</p>
        )}
      </div>

      {/* Back Button */}
      <button className="btn btn-secondary back-button" onClick={onBack}>
        ← Back to Customers
      </button>
    </div>
  )
}

export default Dashboard
