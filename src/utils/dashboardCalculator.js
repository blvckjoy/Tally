// Dashboard Calculator Utilities

/**
 * Check if a date string represents today
 * @param {string} dateString - ISO date string
 * @returns {boolean} true if the date is today
 */
export function isToday(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

/**
 * Check if a date string is in the current month
 * @param {string} dateString - ISO date string
 * @returns {boolean} true if the date is in the current month
 */
export function isCurrentMonth(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  )
}

/**
 * Get total revenue from today's sales
 * @param {Array} sales - Array of sale objects
 * @returns {number} Total revenue from today
 */
export function getTodayRevenue(sales) {
  if (!sales) return 0
  return sales
    .filter((sale) => isToday(sale.createdAt))
    .reduce((sum, sale) => sum + sale.amount, 0)
}

/**
 * Get count of today's transactions
 * @param {Array} sales - Array of sale objects
 * @returns {number} Number of transactions today
 */
export function getTodayTransactions(sales) {
  if (!sales) return 0
  return sales.filter((sale) => isToday(sale.createdAt)).length
}

/**
 * Get total revenue from current month's sales
 * @param {Array} sales - Array of sale objects
 * @returns {number} Total revenue for current month
 */
export function getMonthlyRevenue(sales) {
  if (!sales) return 0
  return sales
    .filter((sale) => isCurrentMonth(sale.createdAt))
    .reduce((sum, sale) => sum + sale.amount, 0)
}

/**
 * Get count of current month's transactions
 * @param {Array} sales - Array of sale objects
 * @returns {number} Number of transactions this month
 */
export function getMonthlyTransactions(sales) {
  if (!sales) return 0
  return sales.filter((sale) => isCurrentMonth(sale.createdAt)).length
}

/**
 * Get average sale amount for current month
 * @param {Array} sales - Array of sale objects
 * @returns {number} Average sale amount (rounded to 2 decimal places)
 */
export function getAverageSale(sales) {
  const monthlyRevenue = getMonthlyRevenue(sales)
  const monthlyTransactions = getMonthlyTransactions(sales)
  if (monthlyTransactions === 0) return 0
  return Math.round((monthlyRevenue / monthlyTransactions) * 100) / 100
}

/**
 * Get count of customers with pending rewards (>= 50 points)
 * @param {Array} customers - Array of customer objects
 * @param {Array} sales - Array of sale objects
 * @returns {number} Number of customers with >= 50 points
 */
export function getRewardsPendingCount(customers, sales) {
  if (!customers || !sales) return 0

  // Calculate total points per customer
  const pointsByCustomer = new Map()
  for (const sale of sales) {
    if (sale.customerId === null) continue // Exclude anonymous sales
    const currentPoints = pointsByCustomer.get(sale.customerId) || 0
    pointsByCustomer.set(sale.customerId, currentPoints + sale.pointsEarned)
  }

  // Count customers with >= 50 points
  let count = 0
  for (const customer of customers) {
    const totalPoints = pointsByCustomer.get(customer.id) || 0
    if (totalPoints >= 50) {
      count++
    }
  }

  return count
}

/**
 * Get top customers by points earned
 * @param {Array} customers - Array of customer objects
 * @param {Array} sales - Array of sale objects
 * @param {number} limit - Maximum number of customers to return (default 5)
 * @returns {Array} Array of {customer, totalPoints} sorted by points descending
 */
export function getTopCustomers(customers, sales, limit = 5) {
  if (!customers || !sales) return []

  // Calculate total points per customer
  const pointsByCustomer = new Map()
  for (const sale of sales) {
    if (sale.customerId === null) continue // Exclude anonymous sales
    const currentPoints = pointsByCustomer.get(sale.customerId) || 0
    pointsByCustomer.set(sale.customerId, currentPoints + sale.pointsEarned)
  }

  // Build array of {customer, totalPoints} for customers with at least 1 point
  const customerResults = []
  for (const customer of customers) {
    const totalPoints = pointsByCustomer.get(customer.id) || 0
    if (totalPoints > 0) {
      customerResults.push({ customer, totalPoints })
    }
  }

  // Sort by totalPoints descending
  customerResults.sort((a, b) => b.totalPoints - a.totalPoints)

  // Return top `limit` customers
  return customerResults.slice(0, limit)
}
