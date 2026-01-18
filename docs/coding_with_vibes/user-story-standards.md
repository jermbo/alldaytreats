# User Story Standards

**Part of:** [Coding with V.I.B.E.S.](README.md) → [5,000ft (Break) Guidelines](5k_documentation_guidelines.md)

**Navigation:** [V.I.B.E.S. Home](README.md) | [5k Guidelines](5k_documentation_guidelines.md) | [Impact/Risk Scoring](user-story-impact-risk-scoring-guide.md) | [Story Splitting](user-story-splitting-guide.md)

## Overview

This document establishes the standards and expectations for writing user stories in software development projects. All user stories must follow these guidelines to ensure consistency, clarity, and effective communication across the development team.

## YAML Front Matter

Each user story file must begin with a YAML block that standardizes metadata and ensures traceability.

```yaml
---
title: PBI-305 – Add preferredName to User
version: 2.0
status: Backlog
assignedTo:
priority: Must Have # Must Have | Should Have | Could Have | Won’t Have
impactRiskScore: 3 # Allowed values: 1, 2, 3, 5, 8, 13, 21
references: # Required: connects this doc to related zoom levels
  - 30k-vision-statement.md
  - 15k-data-model-overview.md
  - 5k-user-profile-feature.md
tags: [feature, backend, profile]
dependencies: []
---
```

## User Story Structure

### 1. User Story Statement

- Format: `As a [user], I want [goal], so that [reason].`
- Must remain problem-focused (no solution creep).

### 2. Problem Statement

- Clear articulation of the problem being solved.
- Captures “why” without prescribing “how.”

### 3. Requirements

- Functional requirements and feature expectations.
- Business rules and constraints (no implementation details).
- Data handling expectations (not implementation details)
- Use numbered lists and sub-lists for clarity.

### 4. Acceptance Criteria

- Written in streamlined **Given-When-Then** format.
- Each criterion should be a single, testable scenario.
- Focus on specific user interactions and expected outcomes.
- Cover primary flow, alternative paths, and edge cases.
- Keep scenarios concise and action-oriented.
- Use numbered lists and sub-lists for clarity.

### 5. Definition of Done

- Code meets project standards.
- Peer reviewed and approved.
- Documentation updated.
- Security, performance, and accessibility reviewed if applicable.

### 6. Impact/Risk Assessment

- Assess impact and risk factors separately.
- Assign a single **impactRiskScore** ∈ {1, 2, 3, 5, 8, 13, 21}.
- If >8 → must be **split** into linked stories.

### 7. Sizing Check

- Can this story be completed independently?
- Does it remain ≤8 on the scale?
- If larger → break down before refinement.

## Scoring Rubric (Impact × Risk)

| Score | Meaning                                             | Examples                                                                   |
| ----- | --------------------------------------------------- | -------------------------------------------------------------------------- |
| 1     | Trivial – low impact, low risk                      | Copy/text change                                                           |
| 2     | Small – introduces new file/surface, low risk       | Utility file, config flag                                                  |
| 3     | Medium – bounded module change                      | Add a model field + CRUD                                                   |
| 5     | Large – cross-module/contract                       | New endpoint + UI wiring                                                   |
| 8     | System-level – high risk, broad surface             | Auth migration, schema rewrite                                             |
| 13    | Epic-scale – multi-system / organization-wide       | Replace payment provider across services; global logging/audit redesign    |
| 21    | Program-scale – fundamental platform transformation | Multi-quarter rewrite of core architecture, e.g., monolith → microservices |

> **Rule:** Nothing may exceed 8. Split items ≥13 into child PBIs linked via `relatedStories`.

## Status Management

### User Story Status Values

- **01_Backlog**: Story is written but not yet prioritized for development.
- **02_Ready** for Refinement: Story needs team review and estimation.
- **03_Planned**: Story is refined, estimated, and queued for development.
- **04_Building**: Story is actively being worked on.
- **05_Awaiting** Review: Development is complete, awaiting code review.
- **06_Reviewing**: Story is under code review.
- **07_Kicked** Back: Story failed review or testing and has been returned for rework.
- **08_QA** Ready: Code review passed, handed to QA.
- **09_Testing**: Story is being tested by QA team.
- **10_Release** Ready: QA passed, story is staged for production deployment.
- **11_Released**: Story is deployed to production.
- **12_Accepted**: Story is released and approved by the Product Owner.
- **13_Blocked**: Story cannot proceed due to external dependency or issue.
- **14_Hold**: Story is paused for business/prioritization reasons.
- **15_Canceled**: Story is no longer needed (superseded, descoped, or invalid).

### Ownership and Assignment

- **Assigned To**: Person currently responsible for moving the story forward
- Assignment changes as the story progresses through different phases

## Review Checklist

Before marking "Ready for Development":

- [ ] YAML front matter present and valid.
- [ ] Problem-only in story/requirements.
- [ ] AC are atomic and testable.
- [ ] ImpactRiskScore ≤ 8.
- [ ] Dependencies linked.
- [ ] Related documents linked.

---

## Related V.I.B.E.S. Documents

- **Main Hub:** [Coding with V.I.B.E.S.](README.md)
- **Parent Guideline:** [5,000ft (Break) Documentation Guidelines](5k_documentation_guidelines.md)
- **Related Standards:**
  - [Impact/Risk Scoring Guide](user-story-impact-risk-scoring-guide.md)
  - [Story Splitting Guide](user-story-splitting-guide.md)
- **Next Steps:** [Ground Level (Execute) Guidelines](ground_level_documentation_guidelines.md)
