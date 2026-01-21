const STORAGE_KEY = 'salesApp_loyaltySettings'

const DEFAULT_SETTINGS = {
  pointsPerUnit: 1000,
  rewardThreshold: 50,
}

export function getLoyaltySettings() {
  const stored = localStorage.getItem(STORAGE_KEY)

  if (!stored) {
    return { ...DEFAULT_SETTINGS }
  }

  try {
    const parsed = JSON.parse(stored)
    const result = {
      pointsPerUnit: isValidSetting(parsed.pointsPerUnit)
        ? parsed.pointsPerUnit
        : DEFAULT_SETTINGS.pointsPerUnit,
      rewardThreshold: isValidSetting(parsed.rewardThreshold)
        ? parsed.rewardThreshold
        : DEFAULT_SETTINGS.rewardThreshold,
    }
    // Include updatedAt if present (backward compatible)
    if (parsed.updatedAt) {
      result.updatedAt = parsed.updatedAt
    }
    return result
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveLoyaltySettings(settings) {
  if (!settings || typeof settings !== 'object') {
    throw new Error('Settings must be an object')
  }

  const { pointsPerUnit, rewardThreshold } = settings

  if (!isValidSetting(pointsPerUnit)) {
    throw new Error('pointsPerUnit must be an integer >= 1')
  }

  if (!isValidSetting(rewardThreshold)) {
    throw new Error('rewardThreshold must be an integer >= 1')
  }

  const updatedAt = new Date().toISOString()
  const toSave = { pointsPerUnit, rewardThreshold, updatedAt }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))

  return toSave
}

function isValidSetting(value) {
  return Number.isInteger(value) && value >= 1
}
