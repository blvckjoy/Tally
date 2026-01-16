import { useState, useEffect } from 'react'
import './App.css'
import {
  addCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
} from './utils/customerStorage'
import { addSale, getSales } from './utils/saleStorage'
import CustomerList from './components/CustomerList'
import CustomerForm from './components/CustomerForm'
import CustomerDetail from './components/CustomerDetail'
import SaleForm from './components/SaleForm'
import Dashboard from './components/Dashboard'

function App() {
  const [customers, setCustomers] = useState([])
  const [sales, setSales] = useState([])
  const [currentView, setCurrentView] = useState('list') // 'list' | 'detail' | 'addCustomer' | 'editCustomer' | 'recordSale' | 'dashboard'
  const [selectedCustomerId, setSelectedCustomerId] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Load customers on mount
  useEffect(() => {
    loadCustomers()
    loadSales()
  }, [])

  const loadCustomers = () => {
    const loaded = getCustomers()
    setCustomers(loaded)
  }

  const loadSales = () => {
    const loaded = getSales()
    setSales(loaded)
  }

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  // Customer click - go to detail view
  const handleCustomerClick = (customerId) => {
    setSelectedCustomerId(customerId)
    setCurrentView('detail')
    setSuccessMessage(null)
  }

  // Add customer
  const handleAddCustomer = (formData) => {
    addCustomer(formData)
    loadCustomers()
    setCurrentView('list')
  }

  // Edit customer
  const handleEditCustomer = (customerId) => {
    setSelectedCustomerId(customerId)
    setCurrentView('editCustomer')
    setSuccessMessage(null)
  }

  const handleUpdateCustomer = (formData) => {
    updateCustomer(selectedCustomerId, formData)
    loadCustomers()
    setCurrentView('detail')
  }

  // Delete customer
  const handleDeleteCustomer = (customerId) => {
    deleteCustomer(customerId)
    loadCustomers()
  }

  // Record sale
  const handleRecordSale = (customerId) => {
    setSelectedCustomerId(customerId)
    setCurrentView('recordSale')
    setSuccessMessage(null)
  }

  const handleSaleSubmit = (formData) => {
    const sale = addSale(formData)
    loadSales() // reload sales to update loyalty calculations
    setSuccessMessage(`Sale recorded: ₦${sale.amount.toLocaleString()}`)
    setCurrentView('detail')
  }

  // Navigation
  const handleBack = () => {
    setCurrentView('list')
    setSelectedCustomerId(null)
    setSuccessMessage(null)
  }

  const handleCancel = () => {
    if (currentView === 'recordSale') {
      setCurrentView('detail')
    } else {
      setCurrentView('list')
      setSelectedCustomerId(null)
    }
    setSuccessMessage(null)
  }

  const handleShowAddCustomer = () => {
    setCurrentView('addCustomer')
    setSelectedCustomerId(null)
    setSuccessMessage(null)
  }

  const handleShowDashboard = () => {
    setCurrentView('dashboard')
    setSelectedCustomerId(null)
    setSuccessMessage(null)
  }

  // Get selected customer
  const selectedCustomer = selectedCustomerId
    ? customers.find(c => c.id === selectedCustomerId)
    : null

  return (
    <div className="app">
      <header className="app-header">
        <h1>Sales App</h1>
        <p className="subtitle">Customer Loyalty & Sales Tracking</p>
      </header>

      <main className="app-main">
        {currentView === 'list' && (
          <div className="list-container">
            <div className="list-header">
              <h2>Customers</h2>
              <div className="header-buttons">
                <button
                  className="btn btn-secondary"
                  onClick={handleShowDashboard}
                >
                  View Dashboard
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleShowAddCustomer}
                >
                  + Add Customer
                </button>
              </div>
            </div>
            <CustomerList
              customers={customers}
              sales={sales}
              onEdit={handleCustomerClick}
              onDelete={handleDeleteCustomer}
            />
          </div>
        )}

        {currentView === 'detail' && (
          <CustomerDetail
            customer={selectedCustomer}
            sales={sales}
            onRecordSale={handleRecordSale}
            onEdit={handleEditCustomer}
            onBack={handleBack}
            successMessage={successMessage}
          />
        )}

        {currentView === 'addCustomer' && (
          <div className="form-container">
            <CustomerForm
              customer={null}
              onSubmit={handleAddCustomer}
              onCancel={handleCancel}
            />
          </div>
        )}

        {currentView === 'editCustomer' && (
          <div className="form-container">
            <CustomerForm
              customer={selectedCustomer}
              onSubmit={handleUpdateCustomer}
              onCancel={handleCancel}
            />
          </div>
        )}

        {currentView === 'recordSale' && selectedCustomer && (
          <SaleForm
            customer={selectedCustomer}
            onSubmit={handleSaleSubmit}
            onCancel={handleCancel}
          />
        )}

        {currentView === 'dashboard' && (
          <Dashboard
            sales={sales}
            customers={customers}
            onBack={() => setCurrentView('list')}
          />
        )}
      </main>
    </div>
  )
}

export default App
