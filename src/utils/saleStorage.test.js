import { describe, it, expect, beforeEach } from 'vitest'
import { addSale, getSales } from './saleStorage'

describe('saleStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('addSale', () => {
    it('should save a sale with customer and calculate points', () => {
      const customerId = 'customer_123'
      const sale = addSale({ amount: 5000, customerId })

      expect(sale).toMatchObject({
        amount: 5000,
        customerId: 'customer_123',
        pointsEarned: 5,
      })
      expect(sale.id).toBeDefined()
      expect(sale.createdAt).toBeDefined()
    })

    it('should save a sale without customer with 0 points', () => {
      const sale = addSale({ amount: 5000, customerId: null })

      expect(sale).toMatchObject({
        amount: 5000,
        customerId: null,
        pointsEarned: 0,
      })
    })

    it('should calculate points correctly (floor rounding)', () => {
      const customerId = 'customer_123'

      const sale1 = addSale({ amount: 5500, customerId })
      expect(sale1.pointsEarned).toBe(5)

      const sale2 = addSale({ amount: 999, customerId })
      expect(sale2.pointsEarned).toBe(0)

      const sale3 = addSale({ amount: 1000, customerId })
      expect(sale3.pointsEarned).toBe(1)
    })

    it('should handle decimal amounts', () => {
      const customerId = 'customer_123'
      const sale = addSale({ amount: 5250.75, customerId })

      expect(sale.amount).toBe(5250.75)
      expect(sale.pointsEarned).toBe(5)
    })

    it('should throw error if amount is missing', () => {
      expect(() => addSale({ amount: null, customerId: 'customer_123' }))
        .toThrow('Amount must be greater than zero')
    })

    it('should throw error if amount is zero', () => {
      expect(() => addSale({ amount: 0, customerId: 'customer_123' }))
        .toThrow('Amount must be greater than zero')
    })

    it('should throw error if amount is negative', () => {
      expect(() => addSale({ amount: -100, customerId: 'customer_123' }))
        .toThrow('Amount must be greater than zero')
    })

    it('should throw error if amount is not a number', () => {
      expect(() => addSale({ amount: 'invalid', customerId: 'customer_123' }))
        .toThrow('Amount must be a valid number')
    })

    it('should persist sale to localStorage', () => {
      addSale({ amount: 1000, customerId: 'customer_123' })

      const stored = localStorage.getItem('salesApp_sales')
      const sales = JSON.parse(stored)

      expect(sales).toHaveLength(1)
      expect(sales[0].amount).toBe(1000)
    })

    it('should append to existing sales', () => {
      addSale({ amount: 1000, customerId: 'customer_123' })
      addSale({ amount: 2000, customerId: 'customer_456' })

      const sales = getSales()
      expect(sales).toHaveLength(2)
    })
  })

  describe('getSales', () => {
    it('should return empty array if no sales exist', () => {
      const sales = getSales()
      expect(sales).toEqual([])
    })

    it('should return all saved sales', () => {
      addSale({ amount: 1000, customerId: 'customer_123' })
      addSale({ amount: 2000, customerId: null })

      const sales = getSales()
      expect(sales).toHaveLength(2)
      expect(sales[0].amount).toBe(1000)
      expect(sales[1].amount).toBe(2000)
    })
  })

  describe('sale description field', () => {
    it('should save sale with description', () => {
      const sale = addSale({
        amount: 5000,
        customerId: 'customer_123',
        description: 'Shoes and accessories'
      })

      expect(sale.description).toBe('Shoes and accessories')
    })

    it('should default description to empty string if not provided', () => {
      const sale = addSale({
        amount: 5000,
        customerId: 'customer_123'
      })

      expect(sale.description).toBe('')
    })
  })
})
