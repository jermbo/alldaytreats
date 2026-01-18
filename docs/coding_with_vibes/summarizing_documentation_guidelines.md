# Summarizing Documentation Guidelines

**Part of:** [Coding with V.I.B.E.S.](README.md) → **Summarize** (Cross-Level)

**Navigation:** [← Execute (Ground)](ground_level_documentation_guidelines.md) | [V.I.B.E.S. Home](README.md) | [Back to Visualize →](30k_documentation_guidelines.md)

This document summarizes best practices and prompts for creating **summarizing documentation** in development projects. These documents ensure the project stays aligned and understandable as it evolves.

## Summary

Summarizing documentation is about **keeping the story straight**. It captures changes, decisions, and the current state of the project. These documents prevent drift between vision, design, and implementation by ensuring everything is reflected clearly for both humans and AI assistants.

## Characteristics of Good Summarizing Documentation

1. **Reflective**

   - Updates when major decisions or changes occur.
   - Records “why” behind choices.

2. **Concise but Comprehensive**

   - Summarizes without overwhelming.
   - Links out to detailed docs when necessary.

3. **Cross-Level Alignment**

   - Connects 30k, 15k, 5k, and ground level docs.
   - Ensures consistency across all layers.

4. **Versioned & Historical**

   - Captures evolution over time.
   - Provides context for future developers.

5. **Accessible**

   - Easy to read for newcomers and AI assistants.
   - Digestible in under 10 minutes.

## Examples of Summarizing Documents

- Decision Log / Architecture Decision Record (ADR)
- Changelog / Release Notes
- Weekly/Monthly Project Summaries
- Meeting notes distilled into structured updates

## Signs of Bad Summarizing Documentation

- Out of date (doesn’t reflect reality).
- Too verbose (walls of text, hard to skim).
- Lacking rationale (records decisions without “why”).
- Scattered (no central place to find summaries).

## Prompts for Summarizing Documents

### Decision Log Entry

```markdown
Write a decision log entry for [decision made].
Include:

- Decision summary
- Alternatives considered
- Reasoning behind choice
- Date and author
```

### Project Changelog

```markdown
Generate a changelog entry for [version/release].
Include:

- New features
- Fixes
- Breaking changes
- Upgrade notes
```

### Weekly Summary

```markdown
Write a one-page summary of the project’s progress this week.
Include:

- Features completed
- Issues encountered
- Key decisions made
- Next steps
```

### Meeting Summary

```markdown
Summarize this meeting into a short, structured document.
Include:

- Main topics discussed
- Decisions made
- Action items (with owners)
```

## Document Examples

### Must-Haves

1. Decision Log / Architecture Decision Records (ADR)
2. Changelog / Release Notes

### Nice-to-Haves

1. Weekly or Monthly Project Summaries
2. Meeting Notes / Action Item Logs

### Project-Specific

1. Retrospective Summaries
2. Migration/Upgrade Notes

---

## Completing the V.I.B.E.S. Cycle

Summarizing documentation closes the V.I.B.E.S. loop:

1. **[Return to Visualize (30k)](30k_documentation_guidelines.md)** — Use learnings to refine project vision
2. **Review [V.I.B.E.S. Visual Overview](VIBES_visuals.md)** — See how knowledge flows through all levels
3. **Update all levels** — Keep documentation current as the project evolves

## Related V.I.B.E.S. Documents

- **Main Hub:** [Coding with V.I.B.E.S.](README.md)
- **Previous Level:** [Ground Level (Execute) Guidelines](ground_level_documentation_guidelines.md)
- **All Levels:** [30k](30k_documentation_guidelines.md) | [15k](15k_documentation_guidelines.md) | [5k](5k_documentation_guidelines.md) | [Ground](ground_level_documentation_guidelines.md)
- **Visuals:** [V.I.B.E.S. Visual Overview](VIBES_visuals.md)
