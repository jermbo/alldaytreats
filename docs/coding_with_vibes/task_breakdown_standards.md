# Task Breakdown Standards

**Part of:** [Coding with V.I.B.E.S.](README.md) → [Ground Level (Execute) Guidelines](ground_level_documentation_guidelines.md)

**Navigation:** [V.I.B.E.S. Home](README.md) | [Ground Level Guidelines](ground_level_documentation_guidelines.md) | [Task Review Checklist](task_breakdown_review_checklist.md) | [Task YAML Schema](task_breakdown_yaml_schema.md)

## Overview

This document establishes the standards and expectations for writing task breakdowns in software development projects. Tasks translate user story requirements into clear, actionable items that developers can estimate, assign, and complete independently.

## YAML Front Matter

Each task file must begin with a YAML block that standardizes metadata and ensures traceability.

```yaml
---
taskId: PBI-305-T001
title: Create user profile API endpoint
parentStory: PBI-305
status: 01_Planned
assignedTo:
dependencies: []
version: 1.0
---
```

### YAML Field Rules

- **taskId**: Must include parent PBI number and task sequence (e.g., `PBI-305-T001`).
- **parentStory**: Required, links to the related user story.
- **status**: Must use simplified task enum (see below).
- **version**: Version number of the standard/task doc format.

## Task Structure

### 1. Description

Brief explanation of what needs to be accomplished. Should describe **what**, not **how**.

### 2. Checklist

Tasks must include a checklist in Markdown format for tracking progress inline.

Example:

```markdown
## Checklist

- [ ] Create endpoint skeleton
- [ ] Add validation logic
- [ ] Write unit tests
- [ ] Update docs
```

### 3. Notes

Optional additional context, constraints, or technical considerations.

## Status Model (Simplified)

Tasks follow a shorter status flow than user stories:

- **01_Planned** – Task is defined and queued for development.
- **02_Building** – Task is actively being worked on.
- **03_Reviewing** – Task is under code review.
- **04_Testing** – Task is being tested.
- **05_Done** – Task meets DoD and is complete.
- **Blocked** – Cannot proceed due to dependency.
- **On Hold** – Paused for business/prioritization reasons.
- **Canceled** – No longer needed.

## Standards and Rules

1. **Granularity**

   - Tasks must be small enough to complete in 1–2 days.
   - Larger efforts must be split into multiple tasks.

2. **Linking**

   - Every task must link to its **parentStory** in YAML.
   - Stories may optionally reference child tasks, but tasks always link upward.

3. **Consistency**

   - YAML required for every task.
   - Status must be from the simplified enum.
   - Description must avoid solution creep.
   - Checklist must reflect all steps to completion.

4. **Acceptance Criteria**

   - Tasks inherit AC from their parent story.
   - No separate AC block required.

5. **Definition of Done (DoD)**
   - Code written following project standards.
   - Tests written and passing.
   - Reviewed and approved.
   - Documentation updated if applicable.

## Example Task File

```yaml
---
taskId: PBI-305-T001
title: Create user profile API endpoint
parentStory: PBI-305
status: 01_Planned
assignedTo: dev1
dependencies: []
version: 1.0
---
```

### Description

Implement a new `/api/profile` endpoint to return user profile details.

### Checklist

- [ ] Define endpoint path and method
- [ ] Add request validation
- [ ] Return response shape per user story
- [ ] Add error handling
- [ ] Write unit tests

### Notes

Keep logic simple — this task is limited to data retrieval only. Updates are a separate task.

---

## Related V.I.B.E.S. Documents

- **Main Hub:** [Coding with V.I.B.E.S.](README.md)
- **Parent Guideline:** [Ground Level (Execute) Documentation Guidelines](ground_level_documentation_guidelines.md)
- **Related Standards:**
  - [Task Review Checklist](task_breakdown_review_checklist.md)
  - [Task YAML Schema](task_breakdown_yaml_schema.md)
- **Previous Level:** [5,000ft User Stories](user-story-standards.md)
