const STORAGE_KEY = 'salesApp_customers'

export function addCustomer({ name, phone, notes }) {
  if (!name) {
    throw new Error('Name is required')
  }

  const customers = getCustomers()
  const customer = {
    id: generateId(),
    name,
    phone,
    notes,
    dateAdded: new Date().toISOString(),
  }

  customers.push(customer)
  saveToStorage(customers)

  return customer
}

export function getCustomers() {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function updateCustomer(id, updates) {
  const customers = getCustomers()
  const index = customers.findIndex(c => c.id === id)

  if (index === -1) {
    throw new Error(`Customer with id ${id} not found`)
  }

  customers[index] = {
    ...customers[index],
    ...updates,
  }

  saveToStorage(customers)
  return customers[index]
}

export function deleteCustomer(id) {
  const customers = getCustomers()
  const index = customers.findIndex(c => c.id === id)

  if (index === -1) {
    throw new Error(`Customer with id ${id} not found`)
  }

  customers.splice(index, 1)
  saveToStorage(customers)
}

function saveToStorage(customers) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers))
}

function generateId() {
  return Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}
