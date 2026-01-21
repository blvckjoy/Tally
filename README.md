# Tally

A lightweight tool for tracking customers, recording sales, and recognizing loyalty without complexity.

Tally is designed for small businesses that want to track regular customers and sales without heavy software or setup.


> **Status:** MVP — opinionated defaults, no backend, and intentionally simple.


## Features

- **Customer Management** — Add, edit, and organize your customers
- **Sales Recording** — Log transactions with optional descriptions
- **Loyalty Points** — Automatic point tracking (1 point per ₦1,000 spent)
- **Rewards Recognition** — Visual indicators when customers reach reward thresholds
- **Dashboard** — At-a-glance metrics for today, this month, and top customers


## Product Notes

### Configurable Loyalty (v1)

Tally supports configurable loyalty rules designed for simplicity and trust.

- **Custom earning rules** — Define how much a customer must spend to earn 1 loyalty point.
- **Custom reward threshold** — Choose how many points qualify a customer for a reward.
- **Forward-only by design** — Changes apply only to future sales. Past sales and earned points are never recalculated.
- **Clear visibility** — Loyalty settings live in the Dashboard and show when they were last updated.

This approach ensures loyalty tracking remains predictable, transparent, and safe for everyday business use.

> Tally intentionally avoids retroactive changes to protect historical data integrity.


## Tech Stack

- React 18
- Vite
- Local Storage (no backend required)
- CSS with custom design system

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Design

Tally uses a "Warm Ledger" design system — the precision of financial software with the warmth of a personal business tool.

- **Typography**: Fraunces (display) + DM Sans (body)
- **Colors**: Warm neutrals with forest green accents
- **Philosophy**: Numbers are the hero. Calm, professional, scannable.

## License

MIT
