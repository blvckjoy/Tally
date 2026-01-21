import { describe, it, expect, beforeEach } from 'vitest'
import {
  getCustomerTotalPoints,
  isRewardAvailable,
  getCustomerSales,
} from './loyaltyCalculator'
import { saveLoyaltySettings } from './loyaltySettings'

describe('loyaltyCalculator', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('getCustomerTotalPoints', () => {
    it('should return 0 for customer with no sales', () => {
      const sales = []
      const customerId = 'customer-1'

      const result = getCustomerTotalPoints(customerId, sales)

      expect(result).toBe(0)
    })

    it('should sum pointsEarned from multiple sales for a customer', () => {
      const sales = [
        { id: '1', customerId: 'customer-1', pointsEarned: 5, amount: 5000 },
        { id: '2', customerId: 'customer-2', pointsEarned: 10, amount: 10000 },
        { id: '3', customerId: 'customer-1', pointsEarned: 15, amount: 15000 },
        { id: '4', customerId: 'customer-1', pointsEarned: 30, amount: 30000 },
      ]
      const customerId = 'customer-1'

      const result = getCustomerTotalPoints(customerId, sales)

      expect(result).toBe(50) // 5 + 15 + 30
    })
  })

  describe('isRewardAvailable', () => {
    it('should return false when points are below threshold', () => {
      const result = isRewardAvailable(49)

      expect(result).toBe(false)
    })

    it('should return true when points equal threshold', () => {
      const result = isRewardAvailable(50)

      expect(result).toBe(true)
    })

    it('should return true when points are above threshold', () => {
      const result = isRewardAvailable(100)

      expect(result).toBe(true)
    })
  })

  describe('getCustomerSales', () => {
    it('should return empty array for customer with no sales', () => {
      const sales = [
        { id: '1', customerId: 'customer-2', amount: 5000, createdAt: '2024-01-01T10:00:00Z' },
      ]
      const customerId = 'customer-1'

      const result = getCustomerSales(customerId, sales)

      expect(result).toEqual([])
    })

    it('should filter sales for specific customer only', () => {
      const sales = [
        { id: '1', customerId: 'customer-1', amount: 5000, createdAt: '2024-01-01T10:00:00Z' },
        { id: '2', customerId: 'customer-2', amount: 10000, createdAt: '2024-01-02T10:00:00Z' },
        { id: '3', customerId: 'customer-1', amount: 15000, createdAt: '2024-01-03T10:00:00Z' },
      ]
      const customerId = 'customer-1'

      const result = getCustomerSales(customerId, sales)

      expect(result).toHaveLength(2)
      expect(result.map((s) => s.id)).toEqual(['3', '1'])
    })

    it('should sort sales by date descending (newest first)', () => {
      const sales = [
        { id: '1', customerId: 'customer-1', amount: 5000, createdAt: '2024-01-01T10:00:00Z' },
        { id: '2', customerId: 'customer-1', amount: 10000, createdAt: '2024-01-03T10:00:00Z' },
        { id: '3', customerId: 'customer-1', amount: 15000, createdAt: '2024-01-02T10:00:00Z' },
      ]
      const customerId = 'customer-1'

      const result = getCustomerSales(customerId, sales)

      expect(result.map((s) => s.id)).toEqual(['2', '3', '1'])
    })
  })

  describe('defensive defaults', () => {
    it('should return 0 when sales array is undefined', () => {
      const result = getCustomerTotalPoints('customer_1', undefined)
      expect(result).toBe(0)
    })

    it('should return 0 when sales array is null', () => {
      const result = getCustomerTotalPoints('customer_1', null)
      expect(result).toBe(0)
    })

    it('should return empty array when sales is undefined', () => {
      const result = getCustomerSales('customer_1', undefined)
      expect(result).toEqual([])
    })
  })

  describe('configurable rewardThreshold', () => {
    it('should use default threshold (50) when no settings exist', () => {
      expect(isRewardAvailable(49)).toBe(false)
      expect(isRewardAvailable(50)).toBe(true)
      expect(isRewardAvailable(51)).toBe(true)
    })

    it('should use custom threshold from settings', () => {
      saveLoyaltySettings({ pointsPerUnit: 1000, rewardThreshold: 25 })

      expect(isRewardAvailable(24)).toBe(false)
      expect(isRewardAvailable(25)).toBe(true)
      expect(isRewardAvailable(26)).toBe(true)
    })

    it('should respect higher custom threshold', () => {
      saveLoyaltySettings({ pointsPerUnit: 1000, rewardThreshold: 100 })

      expect(isRewardAvailable(50)).toBe(false)
      expect(isRewardAvailable(99)).toBe(false)
      expect(isRewardAvailable(100)).toBe(true)
    })

    it('should not recalculate stored pointsEarned', () => {
      const sales = [
        { id: '1', customerId: 'customer-1', pointsEarned: 30, amount: 30000 },
      ]

      // Points calculation uses stored pointsEarned, not amount
      const totalPoints = getCustomerTotalPoints('customer-1', sales)
      expect(totalPoints).toBe(30)

      // Changing settings does not affect stored points
      saveLoyaltySettings({ pointsPerUnit: 500, rewardThreshold: 25 })

      const totalPointsAfter = getCustomerTotalPoints('customer-1', sales)
      expect(totalPointsAfter).toBe(30) // Still 30, not recalculated
    })

    it('should derive reward availability at display time', () => {
      const sales = [
        { id: '1', customerId: 'customer-1', pointsEarned: 40, amount: 40000 },
      ]

      const totalPoints = getCustomerTotalPoints('customer-1', sales)

      // With default threshold (50), not eligible
      expect(isRewardAvailable(totalPoints)).toBe(false)

      // Change threshold to 30
      saveLoyaltySettings({ pointsPerUnit: 1000, rewardThreshold: 30 })

      // Now eligible with same points
      expect(isRewardAvailable(totalPoints)).toBe(true)
    })
  })
})
