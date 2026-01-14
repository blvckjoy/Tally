# DATA.md

> This document defines **all data entities**, their fields, rules, and relationships.
> It is the foundation of the system.
> If something is not defined here, it should not exist in code.

---

## 1. Design Principles for Data

- Keep data minimal and intentional
- System-generated ID is the primary customer identifier
- Customer name is required for usability (human-friendly identification)
- Phone number is optional and used for communication, not identity
- Derive values when possible (do not duplicate unnecessarily)
- Prefer clarity over flexibility

---

## 2. Core Entities

The system has **three core data entities**:

1. Customer
2. Sale
3. Business Settings

No other entities exist in the MVP.

---

## 3. Customer Entity

### Purpose

Represents a real person who can earn loyalty through purchases.

### Fields

- **customer_id**

  - Type: string
  - Description: Internal unique identifier (system-generated)
  - Rules:
    - Primary identity mechanism for customers
    - Used for all customer-sale relationships

- **name** (MANDATORY)

  - Type: string
  - Description: Customer display name
  - Rules:
    - Required for usability
    - Primary field shown in lists and selections
    - Not required to be unique (duplicates are allowed)

- **phone_number**

  - Type: string
  - Description: Optional contact information
  - Format: Stored as raw user input (no normalization at entry)
  - Rules:
    - Optional
    - Not unique (multiple customers can share phone numbers)
    - Validation happens at point of use (e.g., when sending SMS), not at entry
    - Normalization (if any) is for display purposes only

- **notes**

  - Type: string
  - Description: Optional additional information about customer
  - Rules:
    - Optional
    - Free-form text

- **created_at**

  - Type: timestamp
  - Description: When the customer was created

---

## 4. Sale Entity

### Purpose

Represents a single transaction.

### Fields

- **sale_id**

  - Type: string / UUID
  - Description: Internal unique identifier

- **amount**

  - Type: number
  - Description: Sale value
  - Rules:

    - Required
    - Must be greater than 0

- **customer_id** (OPTIONAL)

  - Type: string / UUID
  - Description: Links sale to a customer
  - Rules:

    - Can be null (walk-in / anonymous sale)

- **points_earned**

  - Type: integer
  - Description: Loyalty points earned for this sale
  - Formula: `floor(amount / points_per_currency_unit)`
  - Example: If points_per_currency_unit = 1000, sale of ₦5500 → floor(5500/1000) = 5 points
  - Rules:

    - Calculated automatically at sale creation
    - Not user-editable
    - If customer_id is null (anonymous sale), points_earned = 0

- **created_at**

  - Type: timestamp
  - Description: When the sale occurred

---

## 5. Business Settings Entity

### Purpose

Defines global rules that affect calculations.

### Fields

- **points_per_currency_unit**

  - Type: number
  - Description: Conversion rate for loyalty points
  - Example: 1 point per ₦100

- **reward_threshold**

  - Type: number
  - Description: Points required to unlock a reward

---

## 6. Derived Data (Not Stored Directly)

The following values are **derived**, not stored:

- Total loyalty points for a customer

  - Calculated as the sum of points_earned from all linked sales

- Reward Available status

  - Calculated as: total_points >= reward_threshold
  - Displayed as indicator in customer list/details
  - Recalculated each time customer is viewed

- Top customers

  - Calculated by sorting customers by total points

- Total sales for a day

  - Calculated from sales timestamps

Reason:

- Prevents data inconsistency
- Simplifies updates

---

## 7. Relationships

```text
Customer (1)  <----  (many) Sale
```

- A customer can have many sales
- A sale belongs to at most one customer

---

## 8. Data Validation Rules

### Customer

- Name must be present and non-empty
- Phone number (if provided) has no format requirements at entry
- customer_id must be unique (enforced by system generation)

### Sale

- Amount must be numeric and positive
- points_earned must match business settings

---

## 9. Data Storage Assumptions

- Data is stored locally (initially)
- No cross-device sync in MVP
- All data belongs to a single business
- **Timezone handling:** "Today" is determined by device local time (midnight to midnight)
  - Affects: dashboard totals, edit/delete restrictions
  - Timestamps are stored in UTC, converted to local time for display

---

## 10. Future-Proofing Notes (Not Implemented)

- SMS notifications may use phone_number
- Cloud sync may require business_id
- Staff accounts may require user_id

These are **explicitly excluded** from the current data model.

---

> This data model is intentionally simple.
> Complexity is added only when justified by real usage.
