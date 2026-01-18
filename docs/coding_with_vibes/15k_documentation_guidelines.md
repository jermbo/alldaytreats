# 15,000ft Documentation Guidelines

**Part of:** [Coding with V.I.B.E.S.](README.md) → **Iterate** (15,000ft)

**Navigation:** [← Visualize (30k)](30k_documentation_guidelines.md) | [V.I.B.E.S. Home](README.md) | [Next: Break (5k) →](5k_documentation_guidelines.md)

This document summarizes best practices and prompts for creating mid-altitude (15,000ft) documentation in development projects. These documents bridge the gap between high-level vision (30,000ft) and low-level execution (5,000ft). They focus on **architecture, workflows, and design clarity**.

## Summary

15,000ft documentation should provide a **blueprint** for how the project’s vision will be realized. It translates goals and purpose into **system architecture, workflows, and component responsibilities**. These documents enable teams and AI assistants to design and build effectively in parallel.

## Characteristics of Good 15,000ft Documentation

1. **Bridges Vision to Architecture**

   - Expands on the 30k ft purpose by outlining how the system will achieve it.
   - Translates strategic goals into concrete system components.

2. **System Architecture & Design**

   - High-level diagrams of services, APIs, databases, and dependencies.
   - Identifies core modules, communication flows, and trust boundaries.

3. **Workflows & Data Flows**

   - Captures user journeys, request lifecycles, or data movement across the system.

4. **Technology & Tooling Choices**

   - Explains why frameworks, databases, or services were selected.
   - Records tradeoffs considered.

5. **Boundaries & Interfaces**

   - Defines contracts between parts of the system (APIs, schemas, protocols).
   - Ensures parallel work without ambiguity.

6. **Modularity & Iteration Readiness**

   - Breaks the system into independently designable/testable pieces.
   - Prepares for 5k ft execution docs.

7. **Accessible & Updateable**
   - Uses visuals (diagrams/tables) instead of dense text.
   - Remains a living, updated source of truth.

## Examples of 15,000ft Documents

- System Architecture Overview (diagram + short explanation)
- Workflow / Data Flow Diagrams
- Component Design Docs
- API / Data Contracts
- Tech Stack Rationale

## Signs of Bad 15,000ft Documentation

- Too abstract (vision rehash without design clarity)
- Too detailed (dives into code-level specifics prematurely)
- No diagrams, or unreadable ones without narrative
- Out of sync with current architecture

## Prompts for 15,000ft Documents

### System Architecture Overview

```markdown
Create a high-level system architecture overview for a project that [describe project].
Include:

- Core services or modules
- Databases and storage
- External APIs or dependencies
- Communication flows between parts

Provide both a diagram and a short written explanation.
```

### Workflow / Data Flow Diagram

```markdown
Draw a workflow diagram for the [specific process, e.g., user signup, checkout, data ingestion].
Show:

- Main actors (users, services, systems)
- Sequence of steps
- How data flows between components

Keep it readable at a glance.
```

### Component Design Document

```markdown
Draft a component design document for the [component name].
Include:

- Purpose of this component
- Inputs and outputs
- Dependencies and integrations
- Key responsibilities and boundaries
```

### API / Contract Specification

```markdown
Write a draft API specification for the [service or module].
Include:

- Endpoints (with names and purposes)
- Request/response shapes
- Error handling approach
- Notes on authentication and security
```

### Tech Stack Rationale

```markdown
Summarize the chosen tech stack for this project.
For each major decision (framework, database, hosting, libraries):

- Explain why it was chosen
- List alternatives considered
- Capture tradeoffs and risks
```

## Document Examples

### Must-Haves

1. System Architecture Overview (diagram + text)
2. API Plan / API Contracts
3. Database Schema Documentation

### Nice-to-Haves

1. Auth Flow Diagram
2. User Journeys / Data Flow Diagrams
3. Error Handling Strategy
4. Logging Strategy
5. Testing Strategy (integration/unit approach)

### Project-Specific

1. Tech Stack Rationale / Tradeoff Analysis
2. External Service Integration Docs

---

## Next Steps in V.I.B.E.S.

Once you have your 15,000ft architecture documents:

1. **[Move to 5,000ft (Break)](5k_documentation_guidelines.md)** — Break your architecture into specific features and coding standards
2. **Reference your [30,000ft Vision](30k_documentation_guidelines.md)** — Ensure architecture aligns with project goals
3. **Use [Summarizing Guidelines](summarizing_documentation_guidelines.md)** — Document architectural decisions

## Related V.I.B.E.S. Documents

- **Main Hub:** [Coding with V.I.B.E.S.](README.md)
- **Previous Level:** [30,000ft (Visualize) Guidelines](30k_documentation_guidelines.md)
- **Next Level:** [5,000ft (Break) Guidelines](5k_documentation_guidelines.md)
- **Supporting:** [V.I.B.E.S. Visual Overview](VIBES_visuals.md)
