import { describe, it, expect, beforeEach } from 'vitest'
import { getLoyaltySettings, saveLoyaltySettings } from './loyaltySettings'

describe('loyaltySettings', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('getLoyaltySettings', () => {
    it('should return defaults when no settings exist', () => {
      const settings = getLoyaltySettings()

      expect(settings).toEqual({
        pointsPerUnit: 1000,
        rewardThreshold: 50,
      })
    })

    it('should return defaults when localStorage contains invalid JSON', () => {
      localStorage.setItem('salesApp_loyaltySettings', 'not valid json')

      const settings = getLoyaltySettings()

      expect(settings).toEqual({
        pointsPerUnit: 1000,
        rewardThreshold: 50,
      })
    })

    it('should return defaults for invalid pointsPerUnit', () => {
      localStorage.setItem(
        'salesApp_loyaltySettings',
        JSON.stringify({ pointsPerUnit: 0, rewardThreshold: 50 })
      )

      const settings = getLoyaltySettings()

      expect(settings.pointsPerUnit).toBe(1000)
      expect(settings.rewardThreshold).toBe(50)
    })

    it('should return defaults for non-integer values', () => {
      localStorage.setItem(
        'salesApp_loyaltySettings',
        JSON.stringify({ pointsPerUnit: 1000.5, rewardThreshold: 'fifty' })
      )

      const settings = getLoyaltySettings()

      expect(settings).toEqual({
        pointsPerUnit: 1000,
        rewardThreshold: 50,
      })
    })

    it('should return persisted settings when valid', () => {
      localStorage.setItem(
        'salesApp_loyaltySettings',
        JSON.stringify({ pointsPerUnit: 500, rewardThreshold: 100 })
      )

      const settings = getLoyaltySettings()

      expect(settings).toEqual({
        pointsPerUnit: 500,
        rewardThreshold: 100,
      })
    })
  })

  describe('saveLoyaltySettings', () => {
    it('should save valid settings and return them', () => {
      const result = saveLoyaltySettings({
        pointsPerUnit: 2000,
        rewardThreshold: 75,
      })

      expect(result).toEqual({
        pointsPerUnit: 2000,
        rewardThreshold: 75,
      })
    })

    it('should persist settings to localStorage', () => {
      saveLoyaltySettings({ pointsPerUnit: 500, rewardThreshold: 25 })

      const settings = getLoyaltySettings()

      expect(settings).toEqual({
        pointsPerUnit: 500,
        rewardThreshold: 25,
      })
    })

    it('should reject null settings', () => {
      expect(() => saveLoyaltySettings(null)).toThrow(
        'Settings must be an object'
      )
    })

    it('should reject non-object settings', () => {
      expect(() => saveLoyaltySettings('invalid')).toThrow(
        'Settings must be an object'
      )
    })

    it('should reject pointsPerUnit less than 1', () => {
      expect(() =>
        saveLoyaltySettings({ pointsPerUnit: 0, rewardThreshold: 50 })
      ).toThrow('pointsPerUnit must be an integer >= 1')
    })

    it('should reject negative pointsPerUnit', () => {
      expect(() =>
        saveLoyaltySettings({ pointsPerUnit: -100, rewardThreshold: 50 })
      ).toThrow('pointsPerUnit must be an integer >= 1')
    })

    it('should reject non-integer pointsPerUnit', () => {
      expect(() =>
        saveLoyaltySettings({ pointsPerUnit: 1000.5, rewardThreshold: 50 })
      ).toThrow('pointsPerUnit must be an integer >= 1')
    })

    it('should reject rewardThreshold less than 1', () => {
      expect(() =>
        saveLoyaltySettings({ pointsPerUnit: 1000, rewardThreshold: 0 })
      ).toThrow('rewardThreshold must be an integer >= 1')
    })

    it('should reject negative rewardThreshold', () => {
      expect(() =>
        saveLoyaltySettings({ pointsPerUnit: 1000, rewardThreshold: -50 })
      ).toThrow('rewardThreshold must be an integer >= 1')
    })

    it('should reject non-integer rewardThreshold', () => {
      expect(() =>
        saveLoyaltySettings({ pointsPerUnit: 1000, rewardThreshold: 50.5 })
      ).toThrow('rewardThreshold must be an integer >= 1')
    })
  })
})
