# Ground Level Documentation Guidelines

**Part of:** [Coding with V.I.B.E.S.](README.md) → **Execute & Enhance** (Ground Level)

**Navigation:** [← Break (5k)](5k_documentation_guidelines.md) | [V.I.B.E.S. Home](README.md) | [Next: Summarize →](summarizing_documentation_guidelines.md)

This document summarizes best practices and prompts for creating **ground level documentation** in development projects. These documents focus on **task breakdowns, constants, and type/interface definitions** that guide direct implementation.

## Summary

Ground level documentation is the **closest to the code**. It translates feature-level guidance (5k) into **specific tasks, constants, and types**. These documents help both developers and AI assistants work at the implementation level without ambiguity.

## Characteristics of Good Ground Level Documentation

1. **Highly Specific**

   - Breaks features into step-by-step tasks.
   - Provides clear coding instructions.

2. **Atomic and Modular**

   - Small, composable files (e.g., constants.js, types.ts).
   - Easy to update independently.

3. **Strong Typing & Interfaces**

   - Defines shapes and contracts for data.
   - Prevents miscommunication between components.

4. **Implementation Ready**

   - Can be used directly by a developer or AI to write code.
   - Eliminates guesswork.

5. **Up-to-Date**
   - Updated alongside code changes.
   - Acts as the single source of truth for fine-grained details.

## Examples of Ground Level Documents

- Feature Task Breakdown (checklist of coding steps)
- Constants file (e.g., config values, error codes)
- Type/interface definitions (TS interfaces, DTOs)
- Small helper function specifications

## Signs of Bad Ground Level Documentation

- Too broad (tasks not broken down).
- Too outdated (constants or types don’t match reality).
- Too abstract (missing specific values or definitions).
- Buried in unrelated docs (hard to find).

## Prompts for Ground Level Documents

### Feature Task Breakdown

```markdown
Break down the [feature name] into a list of coding tasks.
Each task should:

- Be small enough for 1–2 hours of work.
- Include details on inputs/outputs.
- Note dependencies between tasks.
```

### Constants File

```markdown
Generate a constants file for [project/feature].
Include:

- Error codes
- Configuration values
- Environment variable keys
  Use clear, descriptive names.
```

### Type/Interface Definitions

```markdown
Write type definitions for [entity or feature] in TypeScript.
Include:

- Interfaces for input/output
- Optional vs required fields
- Example usage
```

### Helper Function Spec

```markdown
Draft a specification for a helper function [name].
Include:

- Purpose
- Input parameters
- Output/return type
- Example usage
```

## Document Examples

### Must-Haves

1. Feature Task Breakdowns (per feature)
2. Constants Files (config values, error codes)
3. Type/Interface Definitions (TS interfaces, DTOs, models)

### Nice-to-Haves

1. Helper Function Specs
2. Module/Component Contracts
3. Environment Variable Documentation

### Project-Specific

1. Domain-Specific Data Models
2. Special Build/Deployment Scripts

---

## Next Steps in V.I.B.E.S.

Once you have your ground level implementation documents:

1. **[Move to Summarize (Cross-Level)](summarizing_documentation_guidelines.md)** — Document decisions and reflect on progress
2. **Use [Task Breakdown Standards](task_breakdown_standards.md)** — Follow structured guidelines for creating tasks
3. **Reference [Task Review Checklist](task_breakdown_review_checklist.md)** — Validate task quality

## Related V.I.B.E.S. Documents

- **Main Hub:** [Coding with V.I.B.E.S.](README.md)
- **Previous Level:** [5,000ft (Break) Guidelines](5k_documentation_guidelines.md)
- **Next Level:** [Summarizing Guidelines](summarizing_documentation_guidelines.md)
- **Standards:** [Task Breakdown Standards](task_breakdown_standards.md) | [Task Review Checklist](task_breakdown_review_checklist.md) | [Task YAML Schema](task_breakdown_yaml_schema.md)
