# Task YAML Schema

**Part of:** [Coding with V.I.B.E.S.](README.md) → [Ground Level (Execute) Guidelines](ground_level_documentation_guidelines.md) → [Task Breakdown Standards](task_breakdown_standards.md)

**Navigation:** [V.I.B.E.S. Home](README.md) | [Ground Level Guidelines](ground_level_documentation_guidelines.md) | [Task Standards](task_breakdown_standards.md) | [Task Review Checklist](task_breakdown_review_checklist.md)

All task documents must begin with YAML metadata for consistency and automation.

```yaml
---
taskId: PBI-305-T001 # Unique ID including parent story reference
title: Create user profile API endpoint
parentStory: PBI-305 # Required link to parent user story
status: 01_Planned # Must use task status enum
assignedTo: dev1 # Developer or team member responsible
dependencies: [] # Other tasks that must be completed first
version: 1.0 # Version of this doc format
---
```

## Task Statuses

- 01_Planned
- 02_Building
- 03_Reviewing
- 04_Testing
- 05_Done
- Blocked
- On Hold
- Canceled

---

## Related V.I.B.E.S. Documents

- **Main Hub:** [Coding with V.I.B.E.S.](README.md)
- **Parent Guidelines:** [Ground Level (Execute) Documentation](ground_level_documentation_guidelines.md)
- **Core Standard:** [Task Breakdown Standards](task_breakdown_standards.md)
- **Validation:** [Task Review Checklist](task_breakdown_review_checklist.md)
