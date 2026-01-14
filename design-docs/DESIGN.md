# DESIGN.md

> This document defines **how the system is structured**.
> It shows components, responsibilities, and how data and actions flow between them.
> No implementation details. No code.

---

## 1. Design Goals

- Keep the system simple and predictable
- Make daily actions (recording a sale) extremely fast
- Enforce clear separation of responsibilities
- Prevent data corruption and inconsistent logic

---

## 2. High-Level Architecture

The system is divided into **three primary layers**:

1. Frontend (User Interface)
2. Application Logic (Rules & Decisions)
3. Data Storage (Persistence)

```text
+----------------------+
|        User          |
|  (Owner / Staff)     |
+----------+-----------+
           |
           v
+----------------------+
|     Frontend UI      |
| (Screens & Forms)    |
+----------+-----------+
           |
           v
+----------------------+
|  Application Logic   |
| (Validation & Rules) |
+----------+-----------+
           |
           v
+----------------------+
|     Data Storage     |
| (Local Persistence) |
+----------------------+
```

---

## 3. Component Responsibilities

### 3.1 Frontend UI

**Responsibilities:**

- Capture user input
- Display data clearly
- Show errors and confirmations

**Must NOT:**

- Calculate loyalty points
- Validate business rules deeply
- Write directly to storage

---

### 3.2 Application Logic

**Responsibilities:**

- Validate inputs
- Enforce business rules
- Calculate loyalty points
- Coordinate data updates

**Must NOT:**

- Render UI
- Store presentation-specific state

---

### 3.3 Data Storage

**Responsibilities:**

- Persist customers, sales, and settings
- Return data when requested

**Must NOT:**

- Contain business rules
- Perform calculations

---

## 4. Key System Interactions

### 4.1 Record Sale Interaction

```text
User
 |
 | enters sale
 v
Frontend UI
 |
 | sends raw input
 v
Application Logic
 |  - validate amount
 |  - resolve customer
 |  - calculate points
 |
 | persist changes
 v
Data Storage
```

---

### 4.2 Add Customer Interaction

```text
User
 |
 | enters phone number
 v
Frontend UI
 |
 | send input
 v
Application Logic
 |  - check uniqueness
 |
 | save customer
 v
Data Storage
```

---

## 5. Data Ownership Rules

- Frontend owns **temporary UI state** only
- Application Logic owns **business decisions**
- Data Storage owns **persistent truth**

No component may bypass another.

---

## 6. Error Handling Strategy

- Validation errors handled in Application Logic
- User-friendly messages surfaced by UI
- Storage errors surfaced as generic failures

System must never fail silently.

---

## 7. What This Design Explicitly Avoids

- UI directly mutating stored data
- Business rules scattered across UI
- Storing derived data (totals, rankings)
- Premature abstraction or over-modularization

---

## 8. Scalability Considerations (Future)

Without changing core design, the system could later:

- Replace local storage with a backend
- Add authentication
- Support multiple devices

These are **not implemented now**, but the structure allows them.

---

## 9. Design Consistency Checklist

This design is valid only if:

- All flows in `FLOWS.md` map cleanly to these components
- All data in `DATA.md` is owned by Data Storage
- All decisions in `DECISIONS.md` are enforceable here

---

> DESIGN.md defines **how the system is built conceptually**.
> If code ever contradicts this document, the code is wrong.
