# DECISIONS.md

> This document records **why** key product and design decisions were made.
> Decisions are backed by **survey insights**, not assumptions.

---

## 1. Why This App Focuses on Small, Informal Businesses

**Survey Insight:**

- Majority of respondents are small shop owners, freelancers, or online sellers
- Many operate via WhatsApp, phone contacts, or notebooks

**Decision:**

- Design for small, informal businesses first
- Avoid enterprise features and complex workflows

**Trade-off:**

- App will not immediately serve large or multi-branch businesses

---

## 2. Why the App Feels Like a "Digital Notebook"

**Survey Insight:**

- Users currently store customer info in scattered places
- Existing tools feel heavy and intimidating

**Decision:**

- Keep UI minimal and familiar
- Use simple language and fast interactions

**Trade-off:**

- Fewer advanced features in the MVP

---

## 3. Why Loyalty Tracking Is Automatic (Not Manual)

**Survey Insight:**

- Many users do not track loyalty consistently
- Forgetfulness and effort are major blockers

**Decision:**

- Loyalty points are calculated automatically
- Users do not manually edit points

**Trade-off:**

- Less flexibility for custom reward logic
- Greater consistency and ease of use

---

## 4. Why System ID Is Primary, Not Phone Number

**Context:**

- Small businesses often deal with incomplete or inconsistent customer data
- Phone numbers may not always be available at point of sale
- Businesses prioritize speed over data completeness

**Decision:**

- Customer identity is based on **system-generated ID**
- Customer **name is mandatory** (required for usability in lists/dropdowns)
- Phone number is **optional** and **non-unique**
- Phone validation happens at point of use (e.g., SMS), not at entry

**Design Implications:**

- Faster customer onboarding (name only)
- More flexible data capture
- Simpler validation at entry
- Phone stored as raw input (no normalization required)

**Trade-offs:**

- **Higher risk of duplicate customers** (same person entered multiple times with slight name variations)
- **Weaker customer identity** (cannot reliably merge or deduplicate)
- **Manual cleanup required** if duplicate customers accumulate
- Phone numbers cannot be used as unique lookup keys

**Why This Trade-off Is Acceptable:**

- Prioritizes speed and simplicity for MVP
- Reflects real-world usage patterns (incomplete data is common)
- Reduces friction for small businesses who value fast entry over perfect data
- Duplicate detection can be added later if proven necessary

---

## 5. Why Speed Is Prioritized Over Completeness

**Survey Insight:**

- Users value speed and simplicity over detailed reporting
- Daily usage requires minimal friction

**Decision:**

- Optimize flows for recording sales quickly
- Reduce required fields and steps

**Trade-off:**

- Less detailed data captured per sale

---

## 6. Why the Dashboard Is Simple

**Survey Insight:**

- Users want immediate answers, not analysis
- Key questions: sales today, top customers

**Decision:**

- Show only essential metrics on dashboard
- Avoid charts and complex analytics

**Trade-off:**

- Less insight for power users

---

## 7. Why Inventory and Marketing Are Excluded

**Survey Insight:**

- No strong demand for inventory or campaigns
- Core pain is customer and loyalty tracking

**Decision:**

- Exclude inventory and marketing from MVP
- Focus on core value proposition

**Trade-off:**

- App may appear limited to some users

---

## 8. Why Local-First Data Storage Is Acceptable Initially

**Survey Insight:**

- Users are already comfortable with informal data storage
- Simplicity and reliability matter more than sync

**Decision:**

- Start with local-first data storage
- Avoid early backend complexity

**Trade-off:**

- Risk of data loss if device is cleared

---

## 9. Why Value Must Be Visible Immediately

**Survey Insight:**

- Price sensitivity is high
- Users need to see benefit quickly

**Decision:**

- Make loyalty points and top customers visible early
- Ensure usefulness within first few days

**Trade-off:**

- Less focus on long-term analytics

---

## 10. Why There Is No User/Staff Differentiation

**Context:**

- PRD identifies two user types: Owner and Staff
- Data model has no User entity

**Decision:**

- MVP assumes **single-user access** (one device, one person at a time)
- No login, no accounts, no access control
- Both owner and staff share full access to all features

**Rationale:**

- Keeps MVP simple
- Target users are very small businesses (often owner-only)
- Access control adds significant complexity

**Trade-off:**

- Staff can modify business settings
- No audit trail of who did what
- Must be addressed if multi-user becomes necessary

---

## 11. Decision Review Policy

- Decisions may change with new evidence
- Any change must reference user feedback or usage data
- Features are added only if they support the core problem

---

> This document protects the product from scope creep.
> If a feature cannot be justified here, it should not be built.
