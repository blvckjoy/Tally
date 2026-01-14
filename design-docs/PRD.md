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
