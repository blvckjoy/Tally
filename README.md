# Tally

A lightweight tool for tracking customers, recording sales, and recognizing loyalty without complexity.

Tally is designed for small businesses that want to track regular customers and sales without heavy software or setup.

> **Status:** MVP — opinionated defaults, no backend, and intentionally simple.

## Features

- **Customer Management** — Add, edit, and delete customers with inline confirmations
- **Sales Recording** — Log transactions linked to customers
- **Configurable Loyalty** — Customize earning rules and reward thresholds (forward-only)
- **Rewards Recognition** — Visual indicators when customers reach reward thresholds
- **Dashboard** — At-a-glance metrics for today, this month, and top customers
- **Settings** — Dedicated view for configuring loyalty rules
- **Responsive Navigation** — Top nav on desktop, bottom nav on mobile

## Architecture

```
src/
├── App.jsx              # Main app with routing and state
├── components/
│   ├── CustomerList     # Customer directory with search and delete
│   ├── CustomerDetail   # Individual customer view with sales history
│   ├── CustomerForm     # Add/edit customer form
│   ├── SaleForm         # Record new sale
│   ├── Dashboard        # Metrics overview (read-only)
│   ├── Settings         # Settings container
│   ├── LoyaltySettings  # Configure loyalty rules
│   └── BottomNav        # Mobile navigation bar
└── utils/
    ├── customerStorage  # Customer CRUD operations
    ├── saleStorage      # Sale CRUD operations
    ├── loyaltyCalculator    # Points calculation logic
    ├── loyaltySettings      # Settings persistence
    └── dashboardCalculator  # Metrics aggregation
```

## Configurable Loyalty

Tally supports configurable loyalty rules designed for simplicity and trust.

- **Custom earning rules** — Define how much a customer must spend to earn 1 loyalty point
- **Custom reward threshold** — Choose how many points qualify a customer for a reward
- **Forward-only by design** — Changes apply only to future sales; past points are never recalculated
- **Last updated indicator** — Shows when loyalty rules were last changed

> Tally intentionally avoids retroactive changes to protect historical data integrity.

## Navigation

- **Desktop**: Top header navigation (Customers, Dashboard, Settings)
- **Mobile**: Bottom navigation bar with the same destinations
- **Dashboard**: Read-only metrics view
- **Settings**: Dedicated destination for configuration

## Tech Stack

- React 19
- Vite 7
- Tailwind CSS 4
- Vitest + Testing Library
- Local Storage (no backend required)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Build for production
npm run build
```

## Design

Tally uses a "Warm Ledger" design system — the precision of financial software with the warmth of a personal business tool.

- **Typography**: Fraunces (display) + DM Sans (body)
- **Colors**: Warm neutrals with forest green accents
- **Philosophy**: Numbers are the hero. Calm, professional, scannable.

## Design Documents

Detailed design documentation is available in `design-docs/`:

- `PRD.md` — Product requirements and scope
- `DATA.md` — Data models and storage
- `FLOWS.md` — User flows and interactions
- `DESIGN.md` — System architecture
- `DECISIONS.md` — Design decisions and rationale

## License

MIT
