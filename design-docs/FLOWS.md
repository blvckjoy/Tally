# FLOWS.md

> This document defines **how users move through the system over time**.
> It describes step-by-step behavior, decisions, and system responses.
> If a flow is unclear here, the UX and logic will be unclear in code.

---

## 1. Design Principles for Flows

- Optimize for **speed and clarity**
- Fewer steps are always better
- Customer name is the primary lookup key
- System should guide users, not ask them to think
- Errors must be handled gracefully, never silently

---

## 2. Flow: App Launch

### Goal

Get the user ready to record a sale as fast as possible.

### Steps

1. User opens the app
2. App loads local data
3. Dashboard is displayed

### Expected Outcome

- User immediately sees today’s sales and top customers

---

## 3. Flow: First Launch / Business Setup

### Goal

Configure loyalty rules before the app can be used.

### Trigger

App detects no Business Settings exist (first-time use).

### Steps

1. User opens app for the first time
2. App detects no Business Settings exist
3. Setup screen is displayed (not Dashboard)
4. Form shows pre-filled defaults:
   - Points per currency unit: 1 point per ₦1000
   - Reward threshold: 50 points
5. User accepts defaults or enters custom values
6. User taps "Save"
7. System validates both values are positive numbers
8. Settings are saved
9. User is taken to Dashboard

### Error Handling

- If either field is empty → show error, block save
- If either value is zero or negative → show error, block save

### Notes

- User cannot skip this step
- Dashboard is inaccessible until setup is complete

---

## 4. Flow: Add New Customer

### Goal

Create a customer quickly with minimal friction.

### Steps

1. User taps "Add Customer"
2. User enters name (mandatory)
3. User enters phone number (optional)
4. User enters notes (optional)
5. User taps "Save"
6. System validates name is present
7. Customer is saved with system-generated ID
8. User returns to customer list

### Error Handling

- If name is empty → show error "Name is required"
- No duplicate detection (system allows multiple customers with same name and/or phone)

---

## 5. Flow: Record Sale (With Customer)

### Goal

Record a sale and automatically update loyalty.

### Steps

1. User taps "New Sale"
2. User enters sale amount
3. User selects customer from dropdown (searches/selects by name)
4. System validates amount
5. System calculates loyalty points based on customer_id linkage
6. Sale is saved
7. Customer loyalty total updates (derived from all sales)
8. Success confirmation is shown

### Error Handling

- Amount missing or invalid → block save, show error
- Customer selection is optional (anonymous sales allowed)

---

## 6. Flow: Record Sale (Without Customer)

### Goal

Allow fast recording of anonymous or walk-in sales.

### Steps

1. User taps "New Sale"
2. User enters sale amount
3. User skips customer field
4. System validates amount
5. Sale is saved
6. Success confirmation is shown

### Notes

- No loyalty points are awarded

---

## 7. Flow: Edit Sale

### Goal

Allow user to correct a mistake in a recent sale.

### Constraint

- Only sales from **today** can be edited

### Steps

1. User views sales list or customer sales history
2. User selects a sale from today
3. User taps "Edit"
4. User modifies amount and/or customer
5. User taps "Save"
6. System validates new amount
7. System recalculates points_earned (if customer linked)
8. Sale is updated
9. Confirmation shown

### Error Handling

- If sale is not from today → show "Cannot edit past sales"
- If new amount is invalid → show error, block save

### Notes

- Loyalty points are automatically recalculated
- Original sale timestamp is preserved

---

## 8. Flow: Delete Sale

### Goal

Allow user to remove an accidental or incorrect sale entry.

### Constraint

- Only sales from **today** can be deleted

### Steps

1. User views sales list or customer sales history
2. User selects a sale from today
3. User taps "Delete"
4. System shows confirmation: "Delete this sale? This cannot be undone."
5. User confirms
6. Sale is permanently removed
7. Customer's loyalty points are recalculated (if applicable)
8. Confirmation shown

### Error Handling

- If sale is not from today → show "Cannot delete past sales"
- If user cancels confirmation → return to previous screen

### Notes

- Deletion is permanent (no soft delete in MVP)
- Loyalty points automatically adjust

---

## 9. Flow: View Customer List

### Goal

Browse all customers and access their records.

### Steps

1. User views customer list (default screen after app launch)
2. List displays all customers showing:
   - Customer name
   - Phone number (if present)
3. User can click on any customer to edit
4. User can delete any customer

### Notes

- No separate "view details" screen in MVP
- Click → Edit (not View)
- Customer sales history and loyalty points visible later (out of STEP 1 scope)

---

## 10. Flow: Edit Customer

### Goal

Allow user to update customer information.

### Entry Point

User clicks on a customer in the customer list.

### Steps

1. User clicks on customer in list
2. Edit form opens with current values pre-filled (name, phone, notes)
3. User modifies any field
4. User taps "Save"
5. System validates:
   - Name is present and non-empty
6. Customer record is updated
7. User returns to customer list

### Error Handling

- If name is empty → show error "Name is required", block save
- If user taps "Cancel" → return to customer list without saving

### Notes

- Phone number has no validation at this stage (stored as raw input)
- No uniqueness checks on name or phone
- All existing sales remain linked via customer_id (immutable)

---

## 11. Flow: View Dashboard

### Goal

Answer key business questions at a glance.

### Displayed Information

- Total sales today
- Number of sales today
- Top customers by loyalty points

### Notes

- No charts in MVP
- Numbers must be readable instantly

---

## 12. Flow: Edit Business Settings

### Goal

Allow owner to adjust loyalty rules after initial setup.

### Steps

1. User taps "Settings" from Dashboard
2. Current values are displayed:
   - Points per currency unit
   - Reward threshold
3. User edits one or both values
4. User taps "Save"
5. System shows confirmation dialog: "Are you sure? This will affect future loyalty calculations."
6. User confirms
7. System validates values are positive numbers
8. Settings are saved
9. Confirmation message shown

### Error Handling

- If either value is empty or invalid → show error, block save
- If user cancels confirmation → return to edit screen

### Notes

- Changes apply to **future sales only**
- Past sales keep their original points_earned values

---

## 13. Flow: Loyalty Reward Threshold Reached

### Goal

Make loyalty value obvious without complex mechanics.

### How It Works

1. When customer list or customer details are displayed
2. System calculates: total_points >= reward_threshold
3. If true, "Reward Available" indicator is shown

### Display Locations

- Customer list (badge or icon next to name)
- Customer details screen

### Notes

- This status is **derived at display time**, not stored (see DATA.md §6)
- Reward redemption logic is manual (outside MVP)

---

## 14. Flow: Export Data (Backup)

### Goal

Allow user to create a backup of all data for safekeeping.

### Steps

1. User taps "Settings" from Dashboard
2. User taps "Export Data"
3. System generates a backup file containing:
   - All customers
   - All sales
   - Business settings
4. System shows share options (WhatsApp, email, save to files)
5. User selects share method
6. File is shared/saved
7. Confirmation shown with date of backup

### File Format

- JSON or CSV (human-readable)
- Filename includes date: `salesapp-backup-2024-01-15.json`

### Notes

- No automatic backups in MVP (user-initiated only)
- Import/restore flow is **out of scope** for MVP
- Recommend users backup weekly

---

## 15. Flow: Error States (General)

### Principles

- Errors must be human-readable
- No technical language
- Clear next action suggested

### Examples

- "Please enter a valid amount"
- "This phone number already exists"

---

## 16. Flow Completion Criteria

Flows are considered successful if:

- Sales can be recorded in under 10 seconds
- Users rarely need instructions
- Mistakes are easy to recover from

---

> FLOWS.md defines **how the system behaves over time**.
> It bridges the gap between data models and architecture.
