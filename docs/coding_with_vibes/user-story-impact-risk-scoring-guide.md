# Impact/Risk Scoring Guide

**Part of:** [Coding with V.I.B.E.S.](README.md) → [5,000ft (Break) Guidelines](5k_documentation_guidelines.md) → [User Story Standards](user-story-standards.md)

**Navigation:** [V.I.B.E.S. Home](README.md) | [User Story Standards](user-story-standards.md) | [Story Splitting Guide](user-story-splitting-guide.md)

## Purpose

Defines how to assign `impactRiskScore` for user stories. This replaces effort-based Fibonacci sizing with an **impact × risk** model.

## Rubric

| Score | Meaning      | Impact Examples       | Risk Examples                             |
| ----- | ------------ | --------------------- | ----------------------------------------- |
| **1** | Trivial      | Localized change      | None                                      |
| **2** | Small        | New file, config      | Minor integration risk                    |
| **3** | Medium       | Module-level change   | Low PII/data handling                     |
| **5** | Large        | Cross-module contract | Moderate risk: external deps, back-compat |
| **8** | System-level | DB/auth migration     | High risk: security, availability         |

## Process

1. **Evaluate Impact**

   - What surface area changes? (files, modules, DB, APIs)

2. **Evaluate Risk**

   - Security, data integrity, external deps, unknowns.

3. **Assign Score**
   - Use the higher of impact/risk.
   - If both are medium-high, bump +1.
   - Cap = 8.

## Cap Rule

- **Nothing > 8.**
- If ≥13 → must be split into smaller linked stories.
- Link via `parentEpic` and `splitOf`.

---

## YAML Fields

```yaml
impactRiskScore: 5
impactFactors:
  - Cross-module API contract
riskFactors:
  - External dependency (Payments API)
impactRiskCap: 8
parentEpic: PBI-1000
splitOf: []
```

## Example

```yaml
title: PBI-305 – Add preferredName to User
impactRiskScore: 3
impactFactors:
  - Single module change
riskFactors:
  - Minor validation
impactRiskCap: 8
```

---

## Related V.I.B.E.S. Documents

- **Main Hub:** [Coding with V.I.B.E.S.](README.md)
- **Parent Guidelines:** [5,000ft (Break) Documentation](5k_documentation_guidelines.md)
- **Core Standard:** [User Story Standards](user-story-standards.md)
- **Related Guide:** [Story Splitting Guide](user-story-splitting-guide.md) (when scores exceed 8)
