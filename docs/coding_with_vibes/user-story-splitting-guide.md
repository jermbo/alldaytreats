# Story Splitting Guide

**Part of:** [Coding with V.I.B.E.S.](README.md) → [5,000ft (Break) Guidelines](5k_documentation_guidelines.md) → [User Story Standards](user-story-standards.md)

**Navigation:** [V.I.B.E.S. Home](README.md) | [User Story Standards](user-story-standards.md) | [Impact/Risk Scoring](user-story-impact-risk-scoring-guide.md)

## Purpose

To enforce the **Impact/Risk Cap**: no story may exceed a score of 8. Any item that would score ≥13 must be split into smaller, independently deliverable stories.

## Principles of Splitting

1. **Cap Enforcement**

   - All user stories must have `impactRiskScore ≤ 8`.
   - Larger stories are considered _epics_ and must be decomposed.

2. **Independence**

   - Each child story must be deliverable and testable on its own.
   - Dependencies must be explicit.

3. **Traceability**
   - Parent/child links are mandatory via YAML:
     ```yaml
     parentEpic: PBI-1000
     splitOf:
       - PBI-1000
     ```

## Splitting Patterns

### 1. Contract-First

- Split by **API contract** → **Producer** → **Consumer**.

### 2. Migration + Flag

- Add schema/migration.
- Dual-write behind flag.
- Flip reads + cleanup.

### 3. Cross-Module Feature

- Backend change.
- UI slice with mock data.
- Integration wiring.

### 4. High-Risk Change

- Isolate security/auth logic.
- Add rollout plan + kill-switch.
- Perform staged rollout.

## Example

**Epic (Too Large):** Replace Profile Service (would score 13).
**Split Into:**

- `PBI-201` Define `/v2/profile` contract (**Score 5**).
- `PBI-202` Implement backend adapter (**Score 5**).
- `PBI-203` Update UI to use `/v2/profile` (**Score 3**).

## Review Checklist

- [ ] All child stories ≤8.
- [ ] Each story has AC and DoD.
- [ ] Links to parent epic and siblings.
- [ ] Dependencies documented.

---

## Related V.I.B.E.S. Documents

- **Main Hub:** [Coding with V.I.B.E.S.](README.md)
- **Parent Guidelines:** [5,000ft (Break) Documentation](5k_documentation_guidelines.md)
- **Core Standard:** [User Story Standards](user-story-standards.md)
- **Related Guide:** [Impact/Risk Scoring Guide](user-story-impact-risk-scoring-guide.md) (for story sizing)
