# Loyalty Classification Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Display customer loyalty points, reward status, and sales history

**Architecture:** Create loyalty calculation utilities, update CustomerList and CustomerDetail to show derived loyalty data from sales

**Tech Stack:** React, Vitest, LocalStorage (existing)

---

## Context

**Completed:**
- STEP 1: Customer Capture (customerStorage.js)
- STEP 2: Purchase Recording (saleStorage.js with points calculation)

**Current State:**
- saleStorage.js calculates pointsEarned per sale (floor(amount / 1000))
- CustomerList shows: name, phone, date added
- CustomerDetail shows: name, phone, notes, date added

**STEP 3 Goal:**
Make loyalty visible by:
1. Calculating total points per customer (sum of pointsEarned from their sales)
2. Determining reward availability (total_points >= reward_threshold)
3. Displaying loyalty points and status in CustomerList and CustomerDetail
4. Showing customer's sales history in CustomerDetail

**Design Decisions (from design docs):**
- Loyalty data is DERIVED, not stored (DATA.md §6)
- "Reward Available" indicator shown when total_points >= reward_threshold
- Default reward_threshold = 50 points (FLOWS.md §3)
- Hardcode threshold for MVP (Business Settings setup deferred to later step)

---

## Task 1: Create Loyalty Calculator Utility

**Files:**
- Create: `src/utils/loyaltyCalculator.js`
- Test: `src/utils/loyaltyCalculator.test.js`

**Step 1: Write failing test for calculating customer total points**

```javascript
import { describe, it, expect, beforeEach } from 'vitest'
import { getCustomerTotalPoints } from './loyaltyCalculator'

describe('loyaltyCalculator', () => {
  describe('getCustomerTotalPoints', () => {
    it('should return 0 when customer has no sales', () => {
      const sales = []
      const customerId = 'customer_1'

      const result = getCustomerTotalPoints(customerId, sales)

      expect(result).toBe(0)
    })
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm test loyaltyCalculator.test.js`
Expected: FAIL with "getCustomerTotalPoints is not defined"

**Step 3: Write minimal implementation**

```javascript
const REWARD_THRESHOLD = 50

export function getCustomerTotalPoints(customerId, sales) {
  return sales
    .filter(sale => sale.customerId === customerId)
    .reduce((total, sale) => total + sale.pointsEarned, 0)
}
```

**Step 4: Run test to verify it passes**

Run: `npm test loyaltyCalculator.test.js`
Expected: PASS

**Step 5: Write failing test for calculating total points with multiple sales**

```javascript
it('should sum pointsEarned from all customer sales', () => {
  const sales = [
    { id: '1', customerId: 'customer_1', pointsEarned: 5 },
    { id: '2', customerId: 'customer_1', pointsEarned: 10 },
    { id: '3', customerId: 'customer_2', pointsEarned: 20 },
    { id: '4', customerId: 'customer_1', pointsEarned: 7 },
  ]
  const customerId = 'customer_1'

  const result = getCustomerTotalPoints(customerId, sales)

  expect(result).toBe(22) // 5 + 10 + 7
})
```

**Step 6: Run test to verify it passes**

Run: `npm test loyaltyCalculator.test.js`
Expected: PASS (implementation already handles this)

**Step 7: Write failing test for checking reward availability**

```javascript
describe('isRewardAvailable', () => {
  it('should return false when points below threshold', () => {
    const result = isRewardAvailable(49)

    expect(result).toBe(false)
  })

  it('should return true when points equal threshold', () => {
    const result = isRewardAvailable(50)

    expect(result).toBe(true)
  })

  it('should return true when points above threshold', () => {
    const result = isRewardAvailable(100)

    expect(result).toBe(true)
  })
})
```

**Step 8: Run test to verify it fails**

Run: `npm test loyaltyCalculator.test.js`
Expected: FAIL with "isRewardAvailable is not defined"

**Step 9: Implement isRewardAvailable**

```javascript
export function isRewardAvailable(totalPoints) {
  return totalPoints >= REWARD_THRESHOLD
}
```

**Step 10: Run test to verify it passes**

Run: `npm test loyaltyCalculator.test.js`
Expected: PASS

**Step 11: Write failing test for getting customer sales**

```javascript
describe('getCustomerSales', () => {
  it('should return empty array when customer has no sales', () => {
    const sales = [
      { id: '1', customerId: 'customer_2', amount: 5000 },
    ]
    const customerId = 'customer_1'

    const result = getCustomerSales(customerId, sales)

    expect(result).toEqual([])
  })

  it('should return all sales for given customer', () => {
    const sales = [
      { id: '1', customerId: 'customer_1', amount: 5000, createdAt: '2024-01-15T10:00:00Z' },
      { id: '2', customerId: 'customer_2', amount: 3000, createdAt: '2024-01-15T11:00:00Z' },
      { id: '3', customerId: 'customer_1', amount: 2500, createdAt: '2024-01-15T12:00:00Z' },
    ]
    const customerId = 'customer_1'

    const result = getCustomerSales(customerId, sales)

    expect(result).toHaveLength(2)
    expect(result[0].id).toBe('1')
    expect(result[1].id).toBe('3')
  })

  it('should return sales sorted by date descending (newest first)', () => {
    const sales = [
      { id: '1', customerId: 'customer_1', amount: 5000, createdAt: '2024-01-15T10:00:00Z' },
      { id: '2', customerId: 'customer_1', amount: 3000, createdAt: '2024-01-15T14:00:00Z' },
      { id: '3', customerId: 'customer_1', amount: 2500, createdAt: '2024-01-15T12:00:00Z' },
    ]
    const customerId = 'customer_1'

    const result = getCustomerSales(customerId, sales)

    expect(result[0].id).toBe('2') // newest
    expect(result[1].id).toBe('3')
    expect(result[2].id).toBe('1') // oldest
  })
})
```

**Step 12: Run test to verify it fails**

Run: `npm test loyaltyCalculator.test.js`
Expected: FAIL with "getCustomerSales is not defined"

**Step 13: Implement getCustomerSales**

```javascript
export function getCustomerSales(customerId, sales) {
  return sales
    .filter(sale => sale.customerId === customerId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}
```

**Step 14: Run test to verify it passes**

Run: `npm test loyaltyCalculator.test.js`
Expected: PASS

**Step 15: Commit**

```bash
git add src/utils/loyaltyCalculator.js src/utils/loyaltyCalculator.test.js
git commit -m "$(cat <<'EOF'
feat: add loyalty calculation utilities

Implements derived loyalty calculations:
- getCustomerTotalPoints: sum points from all customer sales
- isRewardAvailable: check if customer reached reward threshold
- getCustomerSales: get customer's sales history sorted by date

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Update CustomerList to Show Loyalty Points

**Files:**
- Modify: `src/components/CustomerList.jsx:25-40`
- Modify: `src/components/CustomerList.test.jsx` (add new tests)

**Step 1: Write failing test for displaying loyalty points**

Add to CustomerList.test.jsx:

```javascript
it('should display total loyalty points for each customer', () => {
  const mockOnEdit = vi.fn()
  const mockOnDelete = vi.fn()
  const mockSales = [
    { id: 'sale_1', customerId: '1', pointsEarned: 5 },
    { id: 'sale_2', customerId: '1', pointsEarned: 10 },
    { id: 'sale_3', customerId: '2', pointsEarned: 7 },
  ]

  render(
    <CustomerList
      customers={mockCustomers}
      sales={mockSales}
      onEdit={mockOnEdit}
      onDelete={mockOnDelete}
    />
  )

  expect(screen.getByText('15 points')).toBeInTheDocument()
  expect(screen.getByText('7 points')).toBeInTheDocument()
})
```

**Step 2: Run test to verify it fails**

Run: `npm test CustomerList.test.jsx`
Expected: FAIL - CustomerList doesn't accept sales prop

**Step 3: Update CustomerList component to accept sales and display points**

```javascript
import { getCustomerTotalPoints, isRewardAvailable } from '../utils/loyaltyCalculator'

function CustomerList({ customers, sales, onEdit, onDelete }) {
  if (customers.length === 0) {
    return (
      <div className="customer-list">
        <p className="empty-state">No customers yet. Add one to get started.</p>
      </div>
    )
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      onDelete(id)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="customer-list">
      <div className="customer-items">
        {customers.map((customer) => {
          const totalPoints = getCustomerTotalPoints(customer.id, sales)
          const rewardAvailable = isRewardAvailable(totalPoints)

          return (
            <div key={customer.id} className="customer-item">
              <div
                className="customer-info"
                onClick={() => onEdit(customer.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="customer-name">
                  {customer.name}
                  {rewardAvailable && (
                    <span className="reward-badge">Reward Available</span>
                  )}
                </div>
                {customer.phone && (
                  <div className="customer-phone">{customer.phone}</div>
                )}
                <div className="customer-loyalty">{totalPoints} points</div>
                <div className="customer-date">{formatDate(customer.dateAdded)}</div>
              </div>
              <div className="customer-actions">
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(customer.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

**Step 4: Run test to verify it passes**

Run: `npm test CustomerList.test.jsx`
Expected: PASS

**Step 5: Write failing test for reward badge display**

```javascript
it('should display reward badge when customer has enough points', () => {
  const mockOnEdit = vi.fn()
  const mockOnDelete = vi.fn()
  const mockSales = [
    { id: 'sale_1', customerId: '1', pointsEarned: 50 }, // at threshold
  ]

  render(
    <CustomerList
      customers={mockCustomers}
      sales={mockSales}
      onEdit={mockOnEdit}
      onDelete={mockOnDelete}
    />
  )

  expect(screen.getByText('Reward Available')).toBeInTheDocument()
})

it('should not display reward badge when customer has insufficient points', () => {
  const mockOnEdit = vi.fn()
  const mockOnDelete = vi.fn()
  const mockSales = [
    { id: 'sale_1', customerId: '1', pointsEarned: 49 }, // below threshold
  ]

  render(
    <CustomerList
      customers={mockCustomers}
      sales={mockSales}
      onEdit={mockOnEdit}
      onDelete={mockOnDelete}
    />
  )

  expect(screen.queryByText('Reward Available')).not.toBeInTheDocument()
})
```

**Step 6: Run test to verify it passes**

Run: `npm test CustomerList.test.jsx`
Expected: PASS (implementation already handles this)

**Step 7: Update existing tests to pass sales prop**

Update all existing tests in CustomerList.test.jsx to pass sales={[]}:

```javascript
render(
  <CustomerList
    customers={mockCustomers}
    sales={[]}
    onEdit={mockOnEdit}
    onDelete={mockOnDelete}
  />
)
```

**Step 8: Run all CustomerList tests**

Run: `npm test CustomerList.test.jsx`
Expected: ALL PASS

**Step 9: Commit**

```bash
git add src/components/CustomerList.jsx src/components/CustomerList.test.jsx
git commit -m "$(cat <<'EOF'
feat: display loyalty points in customer list

Shows total points and reward badge for each customer.
Points are calculated from sales history.
"Reward Available" badge shown when points >= 50.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Update CustomerDetail to Show Loyalty and Sales History

**Files:**
- Modify: `src/components/CustomerDetail.jsx:14-52`
- Modify: `src/components/CustomerDetail.test.jsx` (add new tests)
- Modify: `src/App.css` (add styles for sales history)

**Step 1: Write failing test for loyalty points display**

Add to CustomerDetail.test.jsx:

```javascript
it('should display total loyalty points', () => {
  const mockCustomer = {
    id: '1',
    name: 'Alice Johnson',
    phone: '555-1234',
    dateAdded: '2024-01-15T10:00:00Z',
  }
  const mockSales = [
    { id: 'sale_1', customerId: '1', pointsEarned: 15 },
    { id: 'sale_2', customerId: '1', pointsEarned: 8 },
  ]
  const mockOnRecordSale = vi.fn()
  const mockOnEdit = vi.fn()
  const mockOnBack = vi.fn()

  render(
    <CustomerDetail
      customer={mockCustomer}
      sales={mockSales}
      onRecordSale={mockOnRecordSale}
      onEdit={mockOnEdit}
      onBack={mockOnBack}
    />
  )

  expect(screen.getByText(/23 points/i)).toBeInTheDocument()
})
```

**Step 2: Run test to verify it fails**

Run: `npm test CustomerDetail.test.jsx`
Expected: FAIL - CustomerDetail doesn't accept sales prop

**Step 3: Update CustomerDetail to display loyalty points**

```javascript
import { getCustomerTotalPoints, isRewardAvailable, getCustomerSales } from '../utils/loyaltyCalculator'

function CustomerDetail({ customer, sales = [], onRecordSale, onEdit, onBack, successMessage }) {
  if (!customer) {
    return (
      <div className="customer-detail">
        <div className="error-message">Customer not found</div>
        <button className="btn btn-secondary" onClick={onBack}>
          Back to List
        </button>
      </div>
    )
  }

  const totalPoints = getCustomerTotalPoints(customer.id, sales)
  const rewardAvailable = isRewardAvailable(totalPoints)
  const customerSales = getCustomerSales(customer.id, sales)

  return (
    <div className="customer-detail">
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      <div className="detail-header">
        <h2>Customer Details</h2>
      </div>

      <div className="detail-content">
        <div className="detail-row">
          <span className="detail-label">Name:</span>
          <span className="detail-value">{customer.name}</span>
        </div>

        {customer.phone && (
          <div className="detail-row">
            <span className="detail-label">Phone:</span>
            <span className="detail-value">{customer.phone}</span>
          </div>
        )}

        {customer.notes && (
          <div className="detail-row">
            <span className="detail-label">Notes:</span>
            <span className="detail-value">{customer.notes}</span>
          </div>
        )}

        <div className="detail-row">
          <span className="detail-label">Date Added:</span>
          <span className="detail-value">
            {new Date(customer.dateAdded).toLocaleDateString()}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Loyalty Points:</span>
          <span className="detail-value">
            {totalPoints} points
            {rewardAvailable && (
              <span className="reward-indicator"> • Reward Available</span>
            )}
          </span>
        </div>
      </div>

      <div className="detail-actions">
        <button
          className="btn btn-primary"
          onClick={() => onRecordSale(customer.id)}
        >
          Record Sale
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => onEdit(customer.id)}
        >
          Edit
        </button>
        <button
          className="btn btn-secondary"
          onClick={onBack}
        >
          Back
        </button>
      </div>
    </div>
  )
}
```

**Step 4: Run test to verify it passes**

Run: `npm test CustomerDetail.test.jsx`
Expected: PASS

**Step 5: Write failing test for reward indicator**

```javascript
it('should show reward indicator when customer has enough points', () => {
  const mockCustomer = {
    id: '1',
    name: 'Alice Johnson',
    dateAdded: '2024-01-15T10:00:00Z',
  }
  const mockSales = [
    { id: 'sale_1', customerId: '1', pointsEarned: 50 },
  ]
  const mockOnRecordSale = vi.fn()
  const mockOnEdit = vi.fn()
  const mockOnBack = vi.fn()

  render(
    <CustomerDetail
      customer={mockCustomer}
      sales={mockSales}
      onRecordSale={mockOnRecordSale}
      onEdit={mockOnEdit}
      onBack={mockOnBack}
    />
  )

  expect(screen.getByText(/Reward Available/i)).toBeInTheDocument()
})

it('should not show reward indicator when customer has insufficient points', () => {
  const mockCustomer = {
    id: '1',
    name: 'Alice Johnson',
    dateAdded: '2024-01-15T10:00:00Z',
  }
  const mockSales = [
    { id: 'sale_1', customerId: '1', pointsEarned: 49 },
  ]
  const mockOnRecordSale = vi.fn()
  const mockOnEdit = vi.fn()
  const mockOnBack = vi.fn()

  render(
    <CustomerDetail
      customer={mockCustomer}
      sales={mockSales}
      onRecordSale={mockOnRecordSale}
      onEdit={mockOnEdit}
      onBack={mockOnBack}
    />
  )

  expect(screen.queryByText(/Reward Available/i)).not.toBeInTheDocument()
})
```

**Step 6: Run test to verify it passes**

Run: `npm test CustomerDetail.test.jsx`
Expected: PASS (implementation already handles this)

**Step 7: Write failing test for sales history display**

```javascript
it('should display customer sales history', () => {
  const mockCustomer = {
    id: '1',
    name: 'Alice Johnson',
    dateAdded: '2024-01-15T10:00:00Z',
  }
  const mockSales = [
    {
      id: 'sale_1',
      customerId: '1',
      amount: 5000,
      pointsEarned: 5,
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: 'sale_2',
      customerId: '1',
      amount: 7500,
      pointsEarned: 7,
      createdAt: '2024-01-16T14:00:00Z',
    },
  ]
  const mockOnRecordSale = vi.fn()
  const mockOnEdit = vi.fn()
  const mockOnBack = vi.fn()

  render(
    <CustomerDetail
      customer={mockCustomer}
      sales={mockSales}
      onRecordSale={mockOnRecordSale}
      onEdit={mockOnEdit}
      onBack={mockOnBack}
    />
  )

  expect(screen.getByText(/Sales History/i)).toBeInTheDocument()
  expect(screen.getByText('₦5,000')).toBeInTheDocument()
  expect(screen.getByText('₦7,500')).toBeInTheDocument()
  expect(screen.getByText('5 points')).toBeInTheDocument()
  expect(screen.getByText('7 points')).toBeInTheDocument()
})

it('should show empty state when customer has no sales', () => {
  const mockCustomer = {
    id: '1',
    name: 'Alice Johnson',
    dateAdded: '2024-01-15T10:00:00Z',
  }
  const mockSales = []
  const mockOnRecordSale = vi.fn()
  const mockOnEdit = vi.fn()
  const mockOnBack = vi.fn()

  render(
    <CustomerDetail
      customer={mockCustomer}
      sales={mockSales}
      onRecordSale={mockOnRecordSale}
      onEdit={mockOnEdit}
      onBack={mockOnBack}
    />
  )

  expect(screen.getByText(/No sales yet/i)).toBeInTheDocument()
})
```

**Step 8: Run test to verify it fails**

Run: `npm test CustomerDetail.test.jsx`
Expected: FAIL - sales history section not implemented

**Step 9: Add sales history section to CustomerDetail**

Update CustomerDetail.jsx to add sales history after detail-actions:

```javascript
// ... existing code ...

      <div className="detail-actions">
        <button
          className="btn btn-primary"
          onClick={() => onRecordSale(customer.id)}
        >
          Record Sale
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => onEdit(customer.id)}
        >
          Edit
        </button>
        <button
          className="btn btn-secondary"
          onClick={onBack}
        >
          Back
        </button>
      </div>

      <div className="sales-history">
        <h3>Sales History</h3>
        {customerSales.length === 0 ? (
          <p className="empty-state">No sales yet. Record the first sale to start tracking loyalty.</p>
        ) : (
          <div className="sales-list">
            {customerSales.map((sale) => (
              <div key={sale.id} className="sale-item">
                <div className="sale-info">
                  <div className="sale-amount">₦{sale.amount.toLocaleString()}</div>
                  <div className="sale-date">
                    {new Date(sale.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>
                <div className="sale-points">{sale.pointsEarned} points</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

**Step 10: Run test to verify it passes**

Run: `npm test CustomerDetail.test.jsx`
Expected: PASS

**Step 11: Update existing CustomerDetail tests to pass sales prop**

Update all existing tests to pass sales={[]}:

```javascript
render(
  <CustomerDetail
    customer={mockCustomer}
    sales={[]}
    onRecordSale={mockOnRecordSale}
    onEdit={mockOnEdit}
    onBack={mockOnBack}
  />
)
```

**Step 12: Run all CustomerDetail tests**

Run: `npm test CustomerDetail.test.jsx`
Expected: ALL PASS

**Step 13: Add CSS styles for sales history**

Add to src/App.css:

```css
/* Sales history */
.sales-history {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.sales-history h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
}

.sales-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sale-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
}

.sale-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sale-amount {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.sale-date {
  font-size: 0.875rem;
  color: #6b7280;
}

.sale-points {
  font-size: 0.875rem;
  font-weight: 500;
  color: #059669;
}

/* Reward badge and indicator */
.reward-badge {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  background-color: #d1fae5;
  color: #065f46;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.reward-indicator {
  color: #059669;
  font-weight: 600;
}

/* Customer loyalty */
.customer-loyalty {
  font-size: 0.875rem;
  color: #059669;
  font-weight: 500;
  margin-top: 0.25rem;
}
```

**Step 14: Commit**

```bash
git add src/components/CustomerDetail.jsx src/components/CustomerDetail.test.jsx src/App.css
git commit -m "$(cat <<'EOF'
feat: display loyalty and sales history in customer detail

Shows total loyalty points with reward indicator.
Displays customer's complete sales history sorted by date.
Empty state shown when customer has no sales.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Update App.jsx to Pass Sales Data

**Files:**
- Modify: `src/App.jsx:1-180`

**Step 1: Import and load sales data in App.jsx**

Update imports and add sales state:

```javascript
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

function App() {
  const [customers, setCustomers] = useState([])
  const [sales, setSales] = useState([])
  const [currentView, setCurrentView] = useState('list')
  const [selectedCustomerId, setSelectedCustomerId] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Load customers and sales on mount
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

  // ... rest of component
```

**Step 2: Update handleSaleSubmit to reload sales**

```javascript
const handleSaleSubmit = (formData) => {
  const sale = addSale(formData)
  loadSales() // reload sales to update loyalty calculations
  setSuccessMessage(`Sale recorded: ₦${sale.amount.toLocaleString()}`)
  setCurrentView('detail')
}
```

**Step 3: Pass sales prop to CustomerList**

```javascript
{currentView === 'list' && (
  <div className="list-container">
    <div className="list-header">
      <h2>Customers</h2>
      <button
        className="btn btn-primary"
        onClick={handleShowAddCustomer}
      >
        + Add Customer
      </button>
    </div>
    <CustomerList
      customers={customers}
      sales={sales}
      onEdit={handleCustomerClick}
      onDelete={handleDeleteCustomer}
    />
  </div>
)}
```

**Step 4: Pass sales prop to CustomerDetail**

```javascript
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
```

**Step 5: Run all tests**

Run: `npm test`
Expected: ALL PASS

**Step 6: Run dev server and manual test**

Run: `npm run dev`
Manual test:
1. Add a customer
2. Record a sale for that customer
3. View customer list - should see loyalty points
4. Click customer to view detail - should see loyalty points and sales history
5. Record another sale
6. Verify points update correctly
7. Record enough sales to reach 50 points - should see "Reward Available"

**Step 7: Commit**

```bash
git add src/App.jsx
git commit -m "$(cat <<'EOF'
feat: integrate sales data with loyalty display

Load sales on mount and pass to CustomerList and CustomerDetail.
Reload sales after recording to update loyalty calculations.
Completes STEP 3: Loyalty Classification.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Completion Checklist

- [ ] loyaltyCalculator.js with full test coverage
- [ ] CustomerList displays loyalty points and reward badge
- [ ] CustomerDetail displays loyalty points, reward indicator, and sales history
- [ ] App.jsx loads and passes sales data to all components
- [ ] All tests passing (should be 70+ total)
- [ ] Manual testing confirms loyalty visible and accurate
- [ ] Empty states handled (no sales, no customers)

---

## Notes

**Hardcoded Values:**
- REWARD_THRESHOLD = 50 (from FLOWS.md §3 default)
- POINTS_PER_CURRENCY_UNIT = 1000 (already in saleStorage.js)
- Business Settings setup deferred to later step

**Design Adherence:**
- Loyalty data is derived at display time (not stored)
- Follows existing architecture pattern from STEP 1 and STEP 2
- No navigation changes (stays within approved customer-centric flow)
- TDD approach maintained throughout

**Out of Scope:**
- Business Settings configuration UI
- Editing/deleting sales
- Dashboard view
- Anonymous sale history
