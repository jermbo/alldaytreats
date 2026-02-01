# 30,000ft Documentation Guidelines

**Part of:** [Coding with V.I.B.E.S.](README.md) → **Visualize** (30,000ft)

**Navigation:** [← V.I.B.E.S. Home](README.md) | [Next: Iterate (15k) →](15k_documentation_guidelines.md)

This document summarizes best practices and resources for creating high-altitude (30,000ft) documentation in development projects. These documents focus on vision, purpose, and strategy rather than implementation details. They are meant to inspire, orient, and align teams.

## Summary

30,000ft documentation should inspire and align. It should provide just enough context to understand the project’s purpose, direction, and goals without diving into details. These documents set the foundation for the 15,000ft and 5,000ft views, ensuring clarity and alignment throughout the project lifecycle.

## Characteristics of Good 30,000ft Documentation

1. **Clarity of Purpose**

   - States why the project exists in plain language.
   - Understandable by someone new to the project (developer, stakeholder, or AI).
   - Answers: What problem are we solving? Why does it matter? Who benefits?

2. **Big Picture, Not Details**

   - Focuses on outcomes and goals, not technical specifics.
   - Example: “The system should allow users to track tasks” rather than “We’ll use a React form with controlled inputs.”

3. **Vision-Oriented**

   - Describes the desired future state (what success looks like).
   - Includes a “True North” statement that guides tradeoffs.

4. **Concise but Composable**

   - Short and digestible (1–3 pages max).
   - Links out to deeper documents instead of cramming in details.
   - Uses visuals sparingly to enhance clarity.

5. **Accessible and Shareable**
   - Written in language suitable for developers, AI assistants, and stakeholders.
   - New team members should be able to read it and immediately “get it.”

## Examples of 30,000ft Documents

- **README / Project Overview** – A quick-start orientation: what the project is, why it exists, and how to run it.
- **Project Requirements Document (PRD)** – Captures project goals, users, and success criteria at a high level.
- **Vision Statement / One-Pager** – A concise statement of the project’s “why” and long-term aim.
- **Personas / Users** (optional) – Who the project serves and what their goals are.
- **Scope & Non-Scope** (optional) – Defines boundaries of what is and isn’t included.

## Signs of Bad 30,000ft Documentation

- Goes into technical weeds too early.
- Too vague or fluffy (marketing copy without clarity).
- Too long or dense (10+ pages before coding starts).
- Out of date and misaligned with actual project direction.

## Litmus Test

A good 30,000ft document should let a new teammate or AI assistant understand:

- The problem being solved
- The goal of the project
- The intended audience
- The definition of success

## Templates and Prompts

Below are copy-pasteable prompts for generating tangible 30,000ft documents with an AI assistant.

### README

```markdown
Write a README that introduces the project, explains its purpose in 3–4 sentences, and includes a quick start guide for new developers.

Create a one-page README that would help a new teammate understand what this project does, who it serves, and how to get started locally.
```

### Project Requirements Document (PRD)

```markdown
Draft a Project Requirements Document (PRD) for a project that [describe the project idea].
Include sections for:

- Purpose
- Target Audience
- Goals
- Success Criteria
- High-Level Scope

Review the PRD draft and suggest what’s missing for it to be actionable at a high level.
```

### Vision Statement / True North

```markdown
Write a one-sentence vision statement that captures the long-term purpose of this project: [project idea].

Refine this draft vision statement into something clear, inspiring, and specific: [paste draft].

Give me three alternative versions of this vision statement in different styles:

1. Concise and professional
2. User-centered
3. Inspirational
```

### Personas / Users

```markdown
Summarize the key audiences for this project in 2–3 short personas.
For each persona include:

- Their role
- Their goal
- How this project helps them

Turn this list of potential users into short persona descriptions suitable for inclusion in a PRD: [list users].
```

### Scope & Non-Scope

```markdown
Based on this PRD draft, list what’s explicitly in scope and what’s explicitly out of scope for version 1 of the project.

Help me define the boundaries of this project so the scope is clear to developers and stakeholders.
```

## Document Examples

### Must-Haves

1. README / Project Overview
2. Project Requirements Document (PRD)
3. Vision Statement / True North

### Nice-to-Haves

1. Personas / User Profiles
2. Scope & Non-Scope

### Project-Specific

1. Pitch Deck / One-Pager
2. Stakeholder Alignment Notes

---

## Next Steps in V.I.B.E.S.

Once you have your 30,000ft vision documents:

1. **[Move to 15,000ft (Iterate)](15k_documentation_guidelines.md)** — Translate your vision into system architecture and design
2. **Use the [V.I.B.E.S. Visual Overview](Vibes_Visuals.md)** — See how all levels connect
3. **Return to [V.I.B.E.S. Home](README.md)** — Access the complete methodology

## Related V.I.B.E.S. Documents

- **Main Hub:** [Coding with V.I.B.E.S.](README.md)
- **Next Level:** [15,000ft (Iterate) Guidelines](15k_documentation_guidelines.md)
- **Supporting:** [Summarizing Guidelines](summarizing_documentation_guidelines.md) for capturing decisions
