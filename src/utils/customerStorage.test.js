import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  addCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
} from './customerStorage'

describe('Customer Storage', () => {

  describe('addCustomer', () => {
    it('should add a new customer with required fields', () => {
      const customer = addCustomer({ name: 'John Doe', phone: '555-1234', notes: 'VIP' })

      expect(customer).toHaveProperty('id')
      expect(customer.name).toBe('John Doe')
      expect(customer.phone).toBe('555-1234')
      expect(customer.notes).toBe('VIP')
      expect(customer).toHaveProperty('dateAdded')
    })

    it('should persist customer to localStorage', () => {
      addCustomer({ name: 'Jane Doe', phone: '555-5678' })
      const customers = getCustomers()

      expect(customers).toHaveLength(1)
      expect(customers[0].name).toBe('Jane Doe')
    })

    it('should require name field', () => {
      expect(() => addCustomer({ phone: '555-1234' })).toThrow()
    })

    it('should allow phone and notes to be optional', () => {
      const customer = addCustomer({ name: 'No Contact' })

      expect(customer.name).toBe('No Contact')
      expect(customer.phone).toBeUndefined()
      expect(customer.notes).toBeUndefined()
    })

    it('should generate unique IDs', () => {
      const c1 = addCustomer({ name: 'Customer 1' })
      const c2 = addCustomer({ name: 'Customer 2' })

      expect(c1.id).not.toBe(c2.id)
    })
  })

  describe('getCustomers', () => {
    it('should return empty array when no customers exist', () => {
      const customers = getCustomers()

      expect(customers).toEqual([])
    })

    it('should return all customers', () => {
      addCustomer({ name: 'Alice', phone: '111-1111' })
      addCustomer({ name: 'Bob', phone: '222-2222' })

      const customers = getCustomers()

      expect(customers).toHaveLength(2)
    })

    it('should return customers in insertion order', () => {
      const c1 = addCustomer({ name: 'First' })
      const c2 = addCustomer({ name: 'Second' })

      const customers = getCustomers()

      expect(customers[0].id).toBe(c1.id)
      expect(customers[1].id).toBe(c2.id)
    })
  })

  describe('updateCustomer', () => {
    it('should update customer fields', () => {
      const customer = addCustomer({ name: 'Old Name', phone: '555-1234' })

      updateCustomer(customer.id, { name: 'New Name', phone: '555-5678' })
      const updated = getCustomers().find(c => c.id === customer.id)

      expect(updated.name).toBe('New Name')
      expect(updated.phone).toBe('555-5678')
    })

    it('should preserve dateAdded', () => {
      const customer = addCustomer({ name: 'Test' })
      const originalDate = customer.dateAdded

      updateCustomer(customer.id, { name: 'Updated' })
      const updated = getCustomers().find(c => c.id === customer.id)

      expect(updated.dateAdded).toBe(originalDate)
    })

    it('should throw if customer not found', () => {
      expect(() => updateCustomer('nonexistent', { name: 'Test' })).toThrow()
    })

    it('should persist changes to localStorage', () => {
      const customer = addCustomer({ name: 'Test' })
      updateCustomer(customer.id, { name: 'Updated' })

      const customers = getCustomers()
      expect(customers[0].name).toBe('Updated')
    })
  })

  describe('deleteCustomer', () => {
    it('should remove customer from list', () => {
      const c1 = addCustomer({ name: 'Keep' })
      const c2 = addCustomer({ name: 'Delete' })

      deleteCustomer(c2.id)

      const customers = getCustomers()
      expect(customers).toHaveLength(1)
      expect(customers[0].id).toBe(c1.id)
    })

    it('should throw if customer not found', () => {
      expect(() => deleteCustomer('nonexistent')).toThrow()
    })

    it('should persist deletion to localStorage', () => {
      const customer = addCustomer({ name: 'Test' })
      deleteCustomer(customer.id)

      const customers = getCustomers()
      expect(customers).toHaveLength(0)
    })
  })

  describe('localStorage persistence', () => {
    it('should restore customers after page refresh', () => {
      addCustomer({ name: 'Persisted' })

      // Simulate page reload by reinitializing
      const customers = getCustomers()

      expect(customers).toHaveLength(1)
      expect(customers[0].name).toBe('Persisted')
    })
  })
})
