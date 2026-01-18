# 5,000ft Documentation Guidelines

**Part of:** [Coding with V.I.B.E.S.](README.md) → **Break** (5,000ft)

**Navigation:** [← Iterate (15k)](15k_documentation_guidelines.md) | [V.I.B.E.S. Home](README.md) | [Next: Execute (Ground) →](ground_level_documentation_guidelines.md)

This document summarizes best practices and prompts for creating low-altitude (5,000ft) documentation in development projects. These documents are tactical, focusing on **features, coding standards, and immediate execution needs**.

## Summary

5,000ft documentation should provide **clear, actionable guidance** for building specific features. It narrows the blueprint from the 15k level into **user stories, acceptance criteria, and coding conventions**. These documents help ensure consistency and smooth collaboration between developers and AI assistants during execution.

## Characteristics of Good 5,000ft Documentation

1. **Action-Oriented**

   - Focuses on deliverable features or coding practices.
   - Contains enough detail to start building right away.

2. **Feature-Centric**

   - Written as user stories or feature specs.
   - Defines acceptance criteria for success.

3. **Coding Standards**

   - Includes linting, formatting, and naming conventions.
   - Ensures code produced is consistent and maintainable.

4. **Testability**

   - Outlines expected behavior and edge cases.
   - Enables straightforward unit/integration test creation.

5. **Contextual but Focused**
   - References higher-level docs when needed but avoids repeating vision/architecture details.

## Examples of 5,000ft Documents

- Feature User Story (with acceptance criteria)
- API endpoint specification for a single feature
- Linting/formatting configs (eslint, prettier)
- Coding standards file

## Signs of Bad 5,000ft Documentation

- Too vague (e.g., "build login feature" without criteria).
- Too detailed (drops into code snippets instead of guiding structure).
- Out of sync with current architecture.
- Missing acceptance tests or edge cases.

## Prompts for 5,000ft Documents

### Feature User Story

```markdown
Write a feature user story for [feature name].
Include:

- Story (As a [user], I want [goal], so that [reason]).
- Acceptance Criteria (bullet list of expected outcomes).
- Notes on dependencies or constraints.
```

### API Endpoint for a Feature

```markdown
Draft the API specification for the [feature] endpoint.
Include:

- Path and method
- Request parameters and body
- Response shape
- Error cases
- Authentication requirements
```

### Linting / Formatting Rules

```markdown
Create a rules file for eslint and prettier in a [framework/language] project.
The rules should:

- Enforce consistent style
- Avoid deeply nested code
- Encourage readability and maintainability
```

### Coding Standards Guide

```markdown
Write a coding standards guide for this project.
Include rules for:

- Naming conventions
- File structure
- Function size/complexity limits
- Commenting and documentation
```

## Document Examples

### Must-Haves

1. Feature User Stories (with acceptance criteria)
2. Linting & Formatting Configs (eslint, prettier, etc.)

### Nice-to-Haves

1. API Endpoint Specs (per feature)
2. Coding Standards Guide (naming, file structure, function guidelines)
3. Feature Test Plans (manual + automated cases)

### Project-Specific

1. Feature-specific Config Docs
2. Dependency/Library Usage Guides

---

## Next Steps in V.I.B.E.S.

Once you have your 5,000ft feature documents:

1. **[Move to Ground Level (Execute & Enhance)](ground_level_documentation_guidelines.md)** — Break features into specific implementation tasks
2. **Use [User Story Standards](user-story-standards.md)** — Follow structured guidelines for writing user stories
3. **Reference [Impact/Risk Scoring](user-story-impact-risk-scoring-guide.md)** — Ensure stories are appropriately sized

## Related V.I.B.E.S. Documents

- **Main Hub:** [Coding with V.I.B.E.S.](README.md)
- **Previous Level:** [15,000ft (Iterate) Guidelines](15k_documentation_guidelines.md)
- **Next Level:** [Ground Level (Execute) Guidelines](ground_level_documentation_guidelines.md)
- **Standards:** [User Story Standards](user-story-standards.md) | [Impact/Risk Scoring](user-story-impact-risk-scoring-guide.md) | [Story Splitting Guide](user-story-splitting-guide.md)
