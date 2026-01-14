const STORAGE_KEY = 'salesApp_sales'
const POINTS_PER_CURRENCY_UNIT = 1000

export function addSale({ amount, customerId, description = '' }) {
  if (!amount || amount <= 0) {
    throw new Error('Amount must be greater than zero')
  }

  const numericAmount = parseFloat(amount)
  if (isNaN(numericAmount)) {
    throw new Error('Amount must be a valid number')
  }

  const sales = getSales()

  // Calculate points: 1 point per 1000 currency units
  // Only award points if customer is linked
  const pointsEarned = customerId
    ? Math.floor(numericAmount / POINTS_PER_CURRENCY_UNIT)
    : 0

  const sale = {
    id: generateId(),
    amount: numericAmount,
    customerId: customerId || null,
    pointsEarned,
    description: description || '',
    createdAt: new Date().toISOString(),
  }

  sales.push(sale)
  saveToStorage(sales)

  return sale
}

export function getSales() {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

function saveToStorage(sales) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sales))
}

function generateId() {
  return Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}
