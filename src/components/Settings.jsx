import LoyaltySettings from './LoyaltySettings'

function Settings() {
  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>Settings</h2>
      </div>
      <div className="dashboard-section">
        <LoyaltySettings />
      </div>
    </div>
  )
}

export default Settings
