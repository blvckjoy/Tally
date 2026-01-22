import './BottomNav.css'

const TABS = [
  { key: 'customers', label: 'Customers', views: ['list', 'detail', 'addCustomer', 'editCustomer', 'recordSale'] },
  { key: 'dashboard', label: 'Dashboard', views: ['dashboard'] },
  { key: 'settings', label: 'Settings', views: ['settings'] },
]

function resolveActiveTab(currentView, isSettingsOpen) {
  // Settings tab takes precedence when loyalty settings is open in dashboard
  if (isSettingsOpen) {
    return 'settings'
  }

  // Find the tab that contains this view
  const matchedTab = TABS.find(tab => tab.views.includes(currentView))
  return matchedTab ? matchedTab.key : 'customers'
}

function BottomNav({ currentView, onNavigate, isSettingsOpen = false }) {
  const activeTab = resolveActiveTab(currentView, isSettingsOpen)

  const handleTabClick = (tab) => {
    if (tab.key === activeTab) return

    // Navigate to the primary view for each tab
    switch (tab.key) {
      case 'customers':
        onNavigate('list')
        break
      case 'dashboard':
        onNavigate('dashboard')
        break
      case 'settings':
        onNavigate('settings')
        break
      default:
        break
    }
  }

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {TABS.map(tab => (
        <button
          key={tab.key}
          className={`bottom-nav-tab ${activeTab === tab.key ? 'bottom-nav-tab--active' : ''}`}
          onClick={() => handleTabClick(tab)}
          aria-current={activeTab === tab.key ? 'page' : undefined}
        >
          <span className="bottom-nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default BottomNav
