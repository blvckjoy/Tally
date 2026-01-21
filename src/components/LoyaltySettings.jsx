import { useState, useEffect } from 'react'
import {
  getLoyaltySettings,
  saveLoyaltySettings,
} from '../utils/loyaltySettings'

function LoyaltySettings() {
  const [pointsPerUnit, setPointsPerUnit] = useState('')
  const [rewardThreshold, setRewardThreshold] = useState('')
  const [errors, setErrors] = useState({})
  const [saveStatus, setSaveStatus] = useState(null)

  // Load initial settings on mount
  useEffect(() => {
    const settings = getLoyaltySettings()
    setPointsPerUnit(String(settings.pointsPerUnit))
    setRewardThreshold(String(settings.rewardThreshold))
  }, [])

  const validateField = (name, value) => {
    const num = parseInt(value, 10)
    if (value === '' || isNaN(num)) {
      return 'Required'
    }
    if (!Number.isInteger(num) || num < 1) {
      return 'Must be a whole number ≥ 1'
    }
    return null
  }

  const handlePointsPerUnitChange = (e) => {
    const value = e.target.value
    setPointsPerUnit(value)
    setErrors((prev) => ({
      ...prev,
      pointsPerUnit: validateField('pointsPerUnit', value),
    }))
    setSaveStatus(null)
  }

  const handleRewardThresholdChange = (e) => {
    const value = e.target.value
    setRewardThreshold(value)
    setErrors((prev) => ({
      ...prev,
      rewardThreshold: validateField('rewardThreshold', value),
    }))
    setSaveStatus(null)
  }

  const isValid = () => {
    const pointsError = validateField('pointsPerUnit', pointsPerUnit)
    const thresholdError = validateField('rewardThreshold', rewardThreshold)
    return !pointsError && !thresholdError
  }

  const handleSave = () => {
    if (!isValid()) return

    try {
      saveLoyaltySettings({
        pointsPerUnit: parseInt(pointsPerUnit, 10),
        rewardThreshold: parseInt(rewardThreshold, 10),
      })
      setSaveStatus('success')
    } catch (error) {
      setSaveStatus('error')
    }
  }

  return (
    <div className="loyalty-settings">
      <div className="section-title">Loyalty Rules</div>

      <div className="settings-form">
        <div className="setting-row">
          <label htmlFor="pointsPerUnit" className="setting-label">
            Spend ₦
          </label>
          <input
            type="number"
            id="pointsPerUnit"
            className={`setting-input ${errors.pointsPerUnit ? 'input-error' : ''}`}
            value={pointsPerUnit}
            onChange={handlePointsPerUnitChange}
            min="1"
            step="1"
          />
          <span className="setting-suffix">→ Earn 1 point</span>
        </div>
        {errors.pointsPerUnit && (
          <div className="field-error">{errors.pointsPerUnit}</div>
        )}

        <div className="setting-row">
          <label htmlFor="rewardThreshold" className="setting-label">
            Reward available at
          </label>
          <input
            type="number"
            id="rewardThreshold"
            className={`setting-input ${errors.rewardThreshold ? 'input-error' : ''}`}
            value={rewardThreshold}
            onChange={handleRewardThresholdChange}
            min="1"
            step="1"
          />
          <span className="setting-suffix">points</span>
        </div>
        {errors.rewardThreshold && (
          <div className="field-error">{errors.rewardThreshold}</div>
        )}

        <div className="settings-helper">
          Changes apply to future sales only. Past sales won't be affected.
        </div>

        <button
          className="btn btn-primary settings-save-btn"
          onClick={handleSave}
          disabled={!isValid()}
        >
          Save Settings
        </button>

        {saveStatus === 'success' && (
          <div className="settings-success">Settings saved</div>
        )}
        {saveStatus === 'error' && (
          <div className="settings-error">Failed to save settings</div>
        )}
      </div>
    </div>
  )
}

export default LoyaltySettings
