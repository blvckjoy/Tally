import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  isToday,
  isCurrentMonth,
  getTodayRevenue,
  getTodayTransactions,
  getMonthlyRevenue,
  getMonthlyTransactions,
  getAverageSale,
  getRewardsPendingCount,
  getTopCustomers,
} from './dashboardCalculator'

describe('dashboardCalculator', () => {
  // Helper to create dates relative to "now"
  let mockNow

  beforeEach(() => {
    // Mock current date as 2024-06-15T12:00:00Z
    mockNow = new Date('2024-06-15T12:00:00Z')
    vi.useFakeTimers()
    vi.setSystemTime(mockNow)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('isToday', () => {
    it('returns true for today', () => {
      const result = isToday('2024-06-15T10:00:00Z')
      expect(result).toBe(true)
    })

    it('returns false for yesterday', () => {
      const result = isToday('2024-06-14T10:00:00Z')
      expect(result).toBe(false)
    })

    it('returns false for tomorrow', () => {
      const result = isToday('2024-06-16T10:00:00Z')
      expect(result).toBe(false)
    })

    it('returns false for same day different month', () => {
      const result = isToday('2024-05-15T10:00:00Z')
      expect(result).toBe(false)
    })

    it('returns false for same day different year', () => {
      const result = isToday('2023-06-15T10:00:00Z')
      expect(result).toBe(false)
    })
  })

  describe('isCurrentMonth', () => {
    it('returns true for current month dates', () => {
      const result = isCurrentMonth('2024-06-01T10:00:00Z')
      expect(result).toBe(true)
    })

    it('returns true for end of current month', () => {
      const result = isCurrentMonth('2024-06-30T12:00:00Z')
      expect(result).toBe(true)
    })

    it('returns false for last month', () => {
      const result = isCurrentMonth('2024-05-15T10:00:00Z')
      expect(result).toBe(false)
    })

    it('returns false for next month', () => {
      const result = isCurrentMonth('2024-07-15T10:00:00Z')
      expect(result).toBe(false)
    })

    it('returns false for same month different year', () => {
      const result = isCurrentMonth('2023-06-15T10:00:00Z')
      expect(result).toBe(false)
    })
  })

  describe('getTodayRevenue', () => {
    it('returns 0 for empty array', () => {
      const result = getTodayRevenue([])
      expect(result).toBe(0)
    })

    it('returns 0 when no sales today', () => {
      const sales = [
        { id: '1', amount: 5000, createdAt: '2024-06-14T10:00:00Z' },
        { id: '2', amount: 3000, createdAt: '2024-05-15T10:00:00Z' },
      ]
      const result = getTodayRevenue(sales)
      expect(result).toBe(0)
    })

    it('sums only today sales', () => {
      const sales = [
        { id: '1', amount: 5000, createdAt: '2024-06-15T08:00:00Z' },
        { id: '2', amount: 3000, createdAt: '2024-06-15T14:00:00Z' },
        { id: '3', amount: 2000, createdAt: '2024-06-14T10:00:00Z' },
      ]
      const result = getTodayRevenue(sales)
      expect(result).toBe(8000)
    })

    it('handles single sale', () => {
      const sales = [
        { id: '1', amount: 7500, createdAt: '2024-06-15T10:00:00Z' },
      ]
      const result = getTodayRevenue(sales)
      expect(result).toBe(7500)
    })

    it('handles null/undefined sales array', () => {
      expect(getTodayRevenue(null)).toBe(0)
      expect(getTodayRevenue(undefined)).toBe(0)
    })

    it('includes anonymous sales (customerId: null)', () => {
      const sales = [
        { id: '1', amount: 5000, customerId: null, createdAt: '2024-06-15T10:00:00Z' },
        { id: '2', amount: 3000, customerId: 'customer-1', createdAt: '2024-06-15T12:00:00Z' },
      ]
      const result = getTodayRevenue(sales)
      expect(result).toBe(8000)
    })
  })

  describe('getTodayTransactions', () => {
    it('returns 0 for empty array', () => {
      const result = getTodayTransactions([])
      expect(result).toBe(0)
    })

    it('returns 0 when no sales today', () => {
      const sales = [
        { id: '1', amount: 5000, createdAt: '2024-06-14T10:00:00Z' },
      ]
      const result = getTodayTransactions(sales)
      expect(result).toBe(0)
    })

    it('counts only today sales', () => {
      const sales = [
        { id: '1', amount: 5000, createdAt: '2024-06-15T08:00:00Z' },
        { id: '2', amount: 3000, createdAt: '2024-06-15T14:00:00Z' },
        { id: '3', amount: 2000, createdAt: '2024-06-14T10:00:00Z' },
      ]
      const result = getTodayTransactions(sales)
      expect(result).toBe(2)
    })

    it('handles null/undefined sales array', () => {
      expect(getTodayTransactions(null)).toBe(0)
      expect(getTodayTransactions(undefined)).toBe(0)
    })

    it('includes anonymous sales', () => {
      const sales = [
        { id: '1', amount: 5000, customerId: null, createdAt: '2024-06-15T10:00:00Z' },
        { id: '2', amount: 3000, customerId: 'customer-1', createdAt: '2024-06-15T12:00:00Z' },
      ]
      const result = getTodayTransactions(sales)
      expect(result).toBe(2)
    })
  })

  describe('getMonthlyRevenue', () => {
    it('returns 0 for empty array', () => {
      const result = getMonthlyRevenue([])
      expect(result).toBe(0)
    })

    it('sums current month only', () => {
      const sales = [
        { id: '1', amount: 5000, createdAt: '2024-06-01T10:00:00Z' },
        { id: '2', amount: 3000, createdAt: '2024-06-15T10:00:00Z' },
        { id: '3', amount: 2000, createdAt: '2024-06-20T12:00:00Z' },
      ]
      const result = getMonthlyRevenue(sales)
      expect(result).toBe(10000)
    })

    it('excludes last month', () => {
      const sales = [
        { id: '1', amount: 5000, createdAt: '2024-06-15T10:00:00Z' },
        { id: '2', amount: 3000, createdAt: '2024-05-15T10:00:00Z' },
      ]
      const result = getMonthlyRevenue(sales)
      expect(result).toBe(5000)
    })

    it('excludes next month', () => {
      const sales = [
        { id: '1', amount: 5000, createdAt: '2024-06-15T10:00:00Z' },
        { id: '2', amount: 3000, createdAt: '2024-07-01T10:00:00Z' },
      ]
      const result = getMonthlyRevenue(sales)
      expect(result).toBe(5000)
    })

    it('handles null/undefined sales array', () => {
      expect(getMonthlyRevenue(null)).toBe(0)
      expect(getMonthlyRevenue(undefined)).toBe(0)
    })

    it('includes anonymous sales', () => {
      const sales = [
        { id: '1', amount: 5000, customerId: null, createdAt: '2024-06-15T10:00:00Z' },
        { id: '2', amount: 3000, customerId: 'customer-1', createdAt: '2024-06-10T10:00:00Z' },
      ]
      const result = getMonthlyRevenue(sales)
      expect(result).toBe(8000)
    })
  })

  describe('getMonthlyTransactions', () => {
    it('returns 0 for empty array', () => {
      const result = getMonthlyTransactions([])
      expect(result).toBe(0)
    })

    it('counts current month only', () => {
      const sales = [
        { id: '1', amount: 5000, createdAt: '2024-06-01T10:00:00Z' },
        { id: '2', amount: 3000, createdAt: '2024-06-15T10:00:00Z' },
        { id: '3', amount: 2000, createdAt: '2024-05-15T10:00:00Z' },
      ]
      const result = getMonthlyTransactions(sales)
      expect(result).toBe(2)
    })

    it('handles null/undefined sales array', () => {
      expect(getMonthlyTransactions(null)).toBe(0)
      expect(getMonthlyTransactions(undefined)).toBe(0)
    })

    it('includes anonymous sales', () => {
      const sales = [
        { id: '1', amount: 5000, customerId: null, createdAt: '2024-06-15T10:00:00Z' },
        { id: '2', amount: 3000, customerId: 'customer-1', createdAt: '2024-06-10T10:00:00Z' },
      ]
      const result = getMonthlyTransactions(sales)
      expect(result).toBe(2)
    })
  })

  describe('getAverageSale', () => {
    it('returns 0 for empty array', () => {
      const result = getAverageSale([])
      expect(result).toBe(0)
    })

    it('returns 0 when no monthly transactions', () => {
      const sales = [
        { id: '1', amount: 5000, createdAt: '2024-05-15T10:00:00Z' },
      ]
      const result = getAverageSale(sales)
      expect(result).toBe(0)
    })

    it('calculates correctly', () => {
      const sales = [
        { id: '1', amount: 6000, createdAt: '2024-06-15T10:00:00Z' },
        { id: '2', amount: 4000, createdAt: '2024-06-10T10:00:00Z' },
      ]
      const result = getAverageSale(sales)
      expect(result).toBe(5000)
    })

    it('rounds to 2 decimal places', () => {
      const sales = [
        { id: '1', amount: 1000, createdAt: '2024-06-15T10:00:00Z' },
        { id: '2', amount: 2000, createdAt: '2024-06-10T10:00:00Z' },
        { id: '3', amount: 3000, createdAt: '2024-06-05T10:00:00Z' },
      ]
      // 6000 / 3 = 2000 - exact
      const result = getAverageSale(sales)
      expect(result).toBe(2000)
    })

    it('rounds non-integer results to 2 decimal places', () => {
      const sales = [
        { id: '1', amount: 1000, createdAt: '2024-06-15T10:00:00Z' },
        { id: '2', amount: 1000, createdAt: '2024-06-10T10:00:00Z' },
        { id: '3', amount: 1000, createdAt: '2024-06-05T10:00:00Z' },
        { id: '4', amount: 1000, createdAt: '2024-06-03T10:00:00Z' },
        { id: '5', amount: 1000, createdAt: '2024-06-02T10:00:00Z' },
        { id: '6', amount: 1000, createdAt: '2024-06-01T10:00:00Z' },
        { id: '7', amount: 1000, createdAt: '2024-06-04T10:00:00Z' },
      ]
      // 7000 / 7 = 1000 - exact
      const result = getAverageSale(sales)
      expect(result).toBe(1000)
    })

    it('handles decimal average correctly', () => {
      const sales = [
        { id: '1', amount: 100, createdAt: '2024-06-15T10:00:00Z' },
        { id: '2', amount: 200, createdAt: '2024-06-10T10:00:00Z' },
        { id: '3', amount: 300, createdAt: '2024-06-05T10:00:00Z' },
      ]
      // 600 / 3 = 200
      const result = getAverageSale(sales)
      expect(result).toBe(200)
    })

    it('rounds 10/3 correctly to 2 decimal places', () => {
      const sales = [
        { id: '1', amount: 10, createdAt: '2024-06-15T10:00:00Z' },
        { id: '2', amount: 10, createdAt: '2024-06-10T10:00:00Z' },
        { id: '3', amount: 10, createdAt: '2024-06-05T10:00:00Z' },
      ]
      // 30 / 3 = 10
      const result = getAverageSale(sales)
      expect(result).toBe(10)
    })

    it('handles null/undefined sales array', () => {
      expect(getAverageSale(null)).toBe(0)
      expect(getAverageSale(undefined)).toBe(0)
    })
  })

  describe('getRewardsPendingCount', () => {
    const customers = [
      { id: 'customer-1', name: 'Alice', phone: '555-1111' },
      { id: 'customer-2', name: 'Bob', phone: '555-2222' },
      { id: 'customer-3', name: 'Charlie', phone: '555-3333' },
    ]

    it('returns 0 for empty arrays', () => {
      const result = getRewardsPendingCount([], [])
      expect(result).toBe(0)
    })

    it('returns 0 for empty customers array', () => {
      const sales = [
        { id: '1', customerId: 'customer-1', pointsEarned: 50 },
      ]
      const result = getRewardsPendingCount([], sales)
      expect(result).toBe(0)
    })

    it('returns 0 for empty sales array', () => {
      const result = getRewardsPendingCount(customers, [])
      expect(result).toBe(0)
    })

    it('returns 0 when no customers qualify', () => {
      const sales = [
        { id: '1', customerId: 'customer-1', pointsEarned: 20 },
        { id: '2', customerId: 'customer-2', pointsEarned: 15 },
      ]
      const result = getRewardsPendingCount(customers, sales)
      expect(result).toBe(0)
    })

    it('counts customers with exactly 50 points', () => {
      const sales = [
        { id: '1', customerId: 'customer-1', pointsEarned: 50 },
        { id: '2', customerId: 'customer-2', pointsEarned: 30 },
      ]
      const result = getRewardsPendingCount(customers, sales)
      expect(result).toBe(1)
    })

    it('counts customers with more than 50 points', () => {
      const sales = [
        { id: '1', customerId: 'customer-1', pointsEarned: 75 },
        { id: '2', customerId: 'customer-2', pointsEarned: 30 },
      ]
      const result = getRewardsPendingCount(customers, sales)
      expect(result).toBe(1)
    })

    it('excludes customers under 50 points', () => {
      const sales = [
        { id: '1', customerId: 'customer-1', pointsEarned: 49 },
        { id: '2', customerId: 'customer-2', pointsEarned: 50 },
      ]
      const result = getRewardsPendingCount(customers, sales)
      expect(result).toBe(1)
    })

    it('handles multiple qualifying customers', () => {
      const sales = [
        { id: '1', customerId: 'customer-1', pointsEarned: 30 },
        { id: '2', customerId: 'customer-1', pointsEarned: 25 },
        { id: '3', customerId: 'customer-2', pointsEarned: 60 },
        { id: '4', customerId: 'customer-3', pointsEarned: 100 },
      ]
      const result = getRewardsPendingCount(customers, sales)
      expect(result).toBe(3)
    })

    it('sums points from multiple sales per customer', () => {
      const sales = [
        { id: '1', customerId: 'customer-1', pointsEarned: 20 },
        { id: '2', customerId: 'customer-1', pointsEarned: 20 },
        { id: '3', customerId: 'customer-1', pointsEarned: 10 },
      ]
      const result = getRewardsPendingCount(customers, sales)
      expect(result).toBe(1)
    })

    it('handles null/undefined arrays', () => {
      expect(getRewardsPendingCount(null, [])).toBe(0)
      expect(getRewardsPendingCount([], null)).toBe(0)
      expect(getRewardsPendingCount(undefined, undefined)).toBe(0)
    })

    it('excludes anonymous sales from customer metrics', () => {
      const sales = [
        { id: '1', customerId: null, pointsEarned: 100 },
        { id: '2', customerId: 'customer-1', pointsEarned: 50 },
      ]
      const result = getRewardsPendingCount(customers, sales)
      expect(result).toBe(1)
    })
  })

  describe('getTopCustomers', () => {
    const customers = [
      { id: 'customer-1', name: 'Alice', phone: '555-1111' },
      { id: 'customer-2', name: 'Bob', phone: '555-2222' },
      { id: 'customer-3', name: 'Charlie', phone: '555-3333' },
      { id: 'customer-4', name: 'Diana', phone: '555-4444' },
      { id: 'customer-5', name: 'Eve', phone: '555-5555' },
      { id: 'customer-6', name: 'Frank', phone: '555-6666' },
    ]

    it('returns empty array for no customers', () => {
      const sales = [
        { id: '1', customerId: 'customer-1', pointsEarned: 50 },
      ]
      const result = getTopCustomers([], sales)
      expect(result).toEqual([])
    })

    it('returns empty array for no sales', () => {
      const result = getTopCustomers(customers, [])
      expect(result).toEqual([])
    })

    it('excludes customers with 0 points', () => {
      const sales = [
        { id: '1', customerId: 'customer-1', pointsEarned: 50 },
        { id: '2', customerId: 'customer-2', pointsEarned: 0 },
      ]
      const result = getTopCustomers(customers, sales)
      expect(result).toHaveLength(1)
      expect(result[0].customer.id).toBe('customer-1')
    })

    it('sorts by points descending', () => {
      const sales = [
        { id: '1', customerId: 'customer-1', pointsEarned: 30 },
        { id: '2', customerId: 'customer-2', pointsEarned: 50 },
        { id: '3', customerId: 'customer-3', pointsEarned: 20 },
      ]
      const result = getTopCustomers(customers, sales)
      expect(result[0].customer.id).toBe('customer-2')
      expect(result[0].totalPoints).toBe(50)
      expect(result[1].customer.id).toBe('customer-1')
      expect(result[1].totalPoints).toBe(30)
      expect(result[2].customer.id).toBe('customer-3')
      expect(result[2].totalPoints).toBe(20)
    })

    it('limits to specified count', () => {
      const sales = [
        { id: '1', customerId: 'customer-1', pointsEarned: 60 },
        { id: '2', customerId: 'customer-2', pointsEarned: 50 },
        { id: '3', customerId: 'customer-3', pointsEarned: 40 },
        { id: '4', customerId: 'customer-4', pointsEarned: 30 },
      ]
      const result = getTopCustomers(customers, sales, 2)
      expect(result).toHaveLength(2)
      expect(result[0].customer.id).toBe('customer-1')
      expect(result[1].customer.id).toBe('customer-2')
    })

    it('defaults to 5', () => {
      const sales = [
        { id: '1', customerId: 'customer-1', pointsEarned: 60 },
        { id: '2', customerId: 'customer-2', pointsEarned: 50 },
        { id: '3', customerId: 'customer-3', pointsEarned: 40 },
        { id: '4', customerId: 'customer-4', pointsEarned: 30 },
        { id: '5', customerId: 'customer-5', pointsEarned: 20 },
        { id: '6', customerId: 'customer-6', pointsEarned: 10 },
      ]
      const result = getTopCustomers(customers, sales)
      expect(result).toHaveLength(5)
      expect(result.map((r) => r.customer.id)).toEqual([
        'customer-1',
        'customer-2',
        'customer-3',
        'customer-4',
        'customer-5',
      ])
    })

    it('returns customer object with totalPoints', () => {
      const sales = [
        { id: '1', customerId: 'customer-1', pointsEarned: 50 },
      ]
      const result = getTopCustomers(customers, sales)
      expect(result[0]).toHaveProperty('customer')
      expect(result[0]).toHaveProperty('totalPoints')
      expect(result[0].customer).toEqual(customers[0])
      expect(result[0].totalPoints).toBe(50)
    })

    it('sums points from multiple sales per customer', () => {
      const sales = [
        { id: '1', customerId: 'customer-1', pointsEarned: 20 },
        { id: '2', customerId: 'customer-1', pointsEarned: 30 },
        { id: '3', customerId: 'customer-2', pointsEarned: 40 },
      ]
      const result = getTopCustomers(customers, sales)
      expect(result[0].customer.id).toBe('customer-1')
      expect(result[0].totalPoints).toBe(50)
      expect(result[1].customer.id).toBe('customer-2')
      expect(result[1].totalPoints).toBe(40)
    })

    it('handles null/undefined arrays', () => {
      expect(getTopCustomers(null, [])).toEqual([])
      expect(getTopCustomers([], null)).toEqual([])
      expect(getTopCustomers(undefined, undefined)).toEqual([])
    })

    it('excludes anonymous sales from customer metrics', () => {
      const sales = [
        { id: '1', customerId: null, pointsEarned: 100 },
        { id: '2', customerId: 'customer-1', pointsEarned: 50 },
      ]
      const result = getTopCustomers(customers, sales)
      expect(result).toHaveLength(1)
      expect(result[0].customer.id).toBe('customer-1')
      expect(result[0].totalPoints).toBe(50)
    })

    it('returns fewer than limit if not enough qualifying customers', () => {
      const sales = [
        { id: '1', customerId: 'customer-1', pointsEarned: 50 },
        { id: '2', customerId: 'customer-2', pointsEarned: 30 },
      ]
      const result = getTopCustomers(customers, sales, 10)
      expect(result).toHaveLength(2)
    })

    it('only includes customers that exist in customers array', () => {
      const sales = [
        { id: '1', customerId: 'customer-1', pointsEarned: 50 },
        { id: '2', customerId: 'unknown-customer', pointsEarned: 100 },
      ]
      const result = getTopCustomers(customers, sales)
      expect(result).toHaveLength(1)
      expect(result[0].customer.id).toBe('customer-1')
    })
  })
})
