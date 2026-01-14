const REWARD_THRESHOLD = 50

export function getCustomerTotalPoints(customerId, sales = []) {
  return (sales || [])
    .filter((sale) => sale.customerId === customerId)
    .reduce((total, sale) => total + sale.pointsEarned, 0)
}

export function isRewardAvailable(totalPoints) {
  return totalPoints >= REWARD_THRESHOLD
}

export function getCustomerSales(customerId, sales = []) {
  return (sales || [])
    .filter((sale) => sale.customerId === customerId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}
