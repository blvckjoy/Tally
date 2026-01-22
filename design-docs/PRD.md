# PRD.md

## 1. Product Name (Working Title)

Customer Loyalty & Sales Tracking App

---

## 2. Problem Statement

Small, informal businesses struggle to:

- Reliably recognize repeat customers
- Track loyalty without relying on memory
- Understand daily and short-term sales performance

Most current solutions are either:

- Too complex for daily use
- Built for large or formal businesses
- Disconnected from how small businesses actually operate (phone- and WhatsApp-first)

---

## 3. Product Vision

Create a **simple, fast, and reliable app** that helps small, informal businesses:

- Record sales in seconds
- Accurately identify repeat and loyal customers
- Reward loyalty without mental tracking

The app should feel like a **digital notebook for WhatsApp-era businesses**, not an accounting or enterprise system.

Value must be visible within the **first few days of use**.

---

## 4. Target Users

### Primary User

- Small business owner (retail shop, salon, café, pharmacy, online seller)

### Secondary User

- Staff member recording sales

### User Characteristics

- Non-technical
- Time-constrained
- Informal operations
- Mobile-first mindset
- Already uses **phone numbers** to recognize customers

---

## 5. User Goals

Users want to:

- Record a sale faster than writing it in a notebook
- Easily find customers by phone number
- Know who their most loyal customers are
- Reward repeat customers confidently

---

## 6. Core Features (MVP Scope)

### Must-Have Features

1. Customer registration (name + **mandatory phone number**)
2. Sale recording (amount + optional customer)
3. Automatic loyalty point calculation
4. Customer sales & loyalty history
5. Simple dashboard showing sales and top customers

---

## 7. Out of Scope (Explicit Non-Goals)

The MVP will NOT include:

- Online payments
- Inventory management
- Marketing campaigns
- Advanced analytics or charts
- Multi-branch or multi-device sync

---

## 8. Functional Requirements

### Data Handling Principles

- Incomplete data is allowed at capture
- Correct data is required at action

### Customer Management

- Customer name is **mandatory** for customer creation
- Phone number is **optional** and **non-unique**
- Customer identity is based on **system-generated ID**
- Customer lookup is primarily name-based
- Phone number validation (if present) happens at point of use, not at entry

### Sales Management

- User can record a sale with an amount
- Sale may optionally be linked to a customer
- Sale amount must be a valid number

### Loyalty System

- Loyalty points are calculated automatically
- Points accumulate over time
- Points are not manually editable

---

## 9. Non-Functional Requirements

- App must feel fast in daily use
- UI must be understandable without training
- Errors must be clear and human-readable
- Data must persist between sessions (local-first)

---

## 10. Success Metrics

The product is successful if:

- A sale can be recorded in under **10 seconds**
- Loyal customers are identifiable within the **first week**
- Loyalty points are understood without explanation
- Daily sales can be checked in **one glance**

---

## 11. Assumptions & Constraints

### Assumptions

- Phone number is the primary customer identifier
- Users accept phone-based identification
- Accuracy of loyalty tracking is more important than onboarding speed

### Constraints

- Simple architecture
- Beginner-friendly implementation
- Local-first data storage

---

## 12. Risks

- Users may forget to attach sales to customers
- Device data loss could erase records
- Incorrect loyalty rules could reduce trust

---

## 13. Open Questions

- Should loyalty rewards be automatic or manually redeemed?
- Should points ever expire?
- Should phone numbers be normalized for display purposes?

---

> This PRD defines **what** the product is and **what it must do**.
> All decisions are justified in `DECISIONS.md`.


---

## Configurable Loyalty Rules (v1)

### Status
Approved for implementation

---

### 1. Problem Statement

Different businesses define “loyalty” differently.  
The current fixed loyalty rule (₦1,000 = 1 point, reward at 50 points) works as a default but limits flexibility across use cases.

Users need basic control over:
- How loyalty points are earned
- When a reward becomes available

This must be done without introducing complexity, migrations, or trust-breaking recalculations.

---

### 2. Goals

**Primary Goals**
- Allow users to configure loyalty rules to match their business
- Preserve historical sales and point data
- Keep the system simple and predictable

**Out of Scope (Explicitly Not Included)**
- Retroactive point recalculation
- Multiple reward tiers
- Point expiration
- Bonus points or promotions
- Refunds or point deductions
- Accumulation across multiple transactions
- Customer-visible loyalty configuration

---

### 3. Core Decision (Locked)

**Loyalty rule changes apply to new sales only.**

- Past sales retain their original `pointsEarned`
- Historical loyalty totals are never recalculated
- Data integrity and user trust take precedence

This decision is locked for v1.

---

### 4. Configurable Parameters (v1)

#### 4.1 Points Earning Rule

**Definition**  
Spend ₦X in a single sale → earn 1 loyalty point

- Field: `pointsPerUnit`
- Type: Integer
- Default: `1000`
- Minimum: `1`

Calculation:

    pointsEarned = Math.floor(amount / pointsPerUnit)

---

#### 4.2 Reward Threshold

**Definition**  
Minimum total points required to show “Reward Available”

- Field: `rewardThreshold`
- Type: Integer
- Default: `50`
- Minimum: `1`

Calculation:

    rewardAvailable = totalPoints >= rewardThreshold

---

### 5. Data Model

**Loyalty Settings Object**

    {
      pointsPerUnit: number,     // default: 1000
      rewardThreshold: number   // default: 50
    }

**Storage**
- Key: `salesApp_loyaltySettings`
- Storage type: `localStorage`
- Stored once per user
- Loaded at application startup

**Defaults**
- If settings are missing or invalid, defaults are used
- Application continues without errors

---

### 6. Behavioral Rules

**Sale Creation**
- Loyalty settings are read at time of sale creation
- `pointsEarned` is calculated once and stored on the sale
- Stored points are immutable

**Loyalty Display**
- Total points are derived by summing stored `pointsEarned`
- Reward availability uses the current `rewardThreshold`

**Backward Compatibility**
- Existing sales remain unchanged
- No data migrations required
- No recalculation of historical points

---

### 7. User Experience

**Settings Location**
- Accessible from Dashboard → Settings
- Not shown in customer-facing views

**Settings UI (v1)**

    Loyalty Settings

    Spend ₦ [ 1000 ] → Earn 1 point
    Reward available at [ 50 ] points

    [ Save ]

**Required Helper Text**

> Changes apply to future sales only. Past sales won’t be affected.

---

### 8. Validation Rules

**Required**
- `pointsPerUnit` must be an integer ≥ 1
- `rewardThreshold` must be an integer ≥ 1
- Non-numeric input is blocked

**Optional Warnings (Non-blocking)**
- Very low reward thresholds
- Very high spend-per-point values

---

### 9. Success Criteria

- Users can configure loyalty rules without breaking existing data
- New sales respect updated rules immediately
- Historical points remain unchanged
- No crashes or recalculation errors
- Minimal cognitive load in the UI

---

### 10. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Users expect past points to change | Explicit helper text |
| Confusion about point differences | Sale-level immutability |
| Pressure for advanced rules | Strict v1 scope |

---

### 11. Future Considerations (Not Implemented)

- Retroactive recalculation with migration strategy
- Accumulation across transactions
- Expiring points
- Multiple reward levels
- Customer-visible loyalty explanations

---

**Summary**

Configurable Loyalty v1 introduces two controlled parameters—points earning and reward threshold—while preserving simplicity, predictability, and trust. Changes are forward-only, historical data is immutable, and complexity is intentionally deferred.



## Internal Update — Configurable Loyalty (Completed)

### Status
**Configurable Loyalty v1 is complete and shipped.**

### What was delivered
Tally’s loyalty system has been evolved from fixed rules to **user-configurable, forward-only loyalty rules**, without breaking existing data or user trust.

The system now supports:

- **Configurable earning rule**
  Users can define how much a customer must spend to earn 1 point (e.g. ₦1,000 → 1 point).

- **Configurable reward threshold**
  Users can define how many points qualify a customer for a reward.

- **Forward-only behavior (intentional)**
  Loyalty rule changes apply only to *future sales*.
  Past sales and earned points are never recalculated or mutated.

- **Derived loyalty logic**
  - Points are stored per sale at creation time.
  - Total points and reward eligibility are derived at display time.
  - This ensures correctness, transparency, and immutability.

- **Dashboard-integrated Loyalty Settings UI**
  - Simple, minimal settings UI under Dashboard
  - Input validation enforced (integers ≥ 1)
  - Clear helper text explaining forward-only behavior

- **“Last updated” indicator**
  - Shows when loyalty rules were last changed
  - Reinforces user confidence that settings were saved
  - Backward compatible with existing data

### Engineering principles upheld
- No retroactive data changes
- No silent recalculation of historical values
- Backward-compatible storage evolution
- Full automated test coverage for all new logic
- Incremental, phase-based commits for traceability

### Current limitations (by design)
- Loyalty rules are global (not per customer)
- No reward redemption tracking yet
- No previews or simulations of rule changes
- No customer-facing visibility of loyalty rules

These are **intentional MVP constraints**, not omissions.

### Outcome
Tally now supports **trustworthy, configurable loyalty rules** suitable for real-world use, while preserving simplicity and data integrity.

### Next planned area
**Navigation & Mobile UX polish**, starting with evaluation of a bottom navigation bar for mobile users.


## Navigation

- Desktop: Top header navigation (Customers, Dashboard, Settings)
- Mobile: Bottom navigation bar
- Dashboard is read-only
- Settings is a first-class destination