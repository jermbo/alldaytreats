# CSS Refactoring Prompt

Use this prompt in AI coding assistants (ChatGPT, Claude, Cursor, etc.) to refactor CSS according to modern best practices.

---

## The Prompt

```
I want to fundamentally rethink and refactor my CSS using modern standards and best practices.

## RULES

### 1. Use Modern CSS Nesting Properly

Use NATIVE CSS nesting (not SASS) for ONLY these cases:

✅ NEST these:
- Pseudo-classes: &:hover, &:focus, &:active, &:disabled
- Pseudo-elements: &::before, &::after
- Attribute selectors: &[disabled], &[aria-hidden="true"]
- Container queries: @container (max-width: 768px)
- Media queries: @media (prefers-reduced-motion: reduce)

❌ DO NOT NEST these:
- BEM modifiers: &--active, &--open (SASS syntax, not native CSS)
- Child classes: .parent { .child {} }
- Descendant selectors nested inside parents

Example of CORRECT native CSS nesting:

```css
.button {
  color: blue;

  &:hover {
    color: red;
  }

  &::before {
    content: "→";
  }

  @container (max-width: 768px) {
    font-size: 14px;
  }
}
```

Example of INCORRECT (SASS-style):

```css
.cart {
  &--open {  /* ❌ WRONG - This is SASS, not native CSS */
    opacity: 1;
  }
}
```

Correct alternative:

```css
.cart {
  opacity: 0;
}

.cart--open {  /* ✅ CORRECT - Separate rule */
  opacity: 1;
}
```

### 2. Maximum Nesting Depth: 3 Levels

Never nest deeper than 3 levels. This prevents deeply nested selectors that are hard to maintain.

### 3. No Magic Values - Create Meaningful Custom Properties

Every value should come from a design system. Do NOT recreate Tailwind - create only what you actually need based on usage patterns.

When you see repeated values (px for spacing, em for shadows, opacity values, etc.):
1. Identify the pattern
2. Create a meaningful custom property
3. Group it with related items in :root
4. Use descriptive names that indicate purpose

Example magic values to eliminate:
- Arbitrary spacing: 12px, 6px, 24px
- Arbitrary opacity: 0.7, 0.8, 0.6
- Arbitrary border-radius: 4px, 8px
- Arbitrary shadows: random rgba() values
- Arbitrary z-index: 100, 200, 999

Create semantic tokens:
```css
:root {
  /* Spacing */
  --spacing-xs: 0.375rem;
  --spacing-sm: 0.5rem;
  --spacing-base: 1rem;

  /* Opacity */
  --opacity-disabled: 0.4;
  --opacity-secondary: 0.7;
  --opacity-hover: 0.9;

  /* Z-index */
  --z-sticky: 100;
  --z-overlay: 200;
}
```

### 4. Intrinsic Design with Container Queries

Components should adapt to their CONTAINER, not the screen size. This makes them work anywhere.

Replace viewport media queries with container queries where possible:

OLD WAY:
```css
.card {
  padding: 24px;
}

@media (max-width: 768px) {
  .card {
    padding: 16px;
  }
}
```

NEW WAY:
```css
.sidebar {
  container-type: inline-size;
  container-name: sidebar;
}

.card {
  padding: var(--spacing-lg);

  @container sidebar (max-width: 400px) {
    padding: var(--spacing-base);
  }
}
```

## YOUR TASK

1. Read through ALL my CSS files
2. Identify patterns and magic values
3. Create a comprehensive custom properties system in variables.css
4. Refactor each CSS file following these rules:
   - Use proper native CSS nesting (pseudo-selectors and queries only)
   - Replace all magic values with custom properties
   - Convert media queries to container queries where appropriate
   - Keep nesting max 3 levels deep
   - Maintain all existing functionality

5. Ask me questions if you need clarification on:
   - Container query strategy (which elements should be containers)
   - Variable naming conventions I prefer
   - Browser support requirements
   - Anything that seems unclear

Think deeply about proper and modern CSS techniques. Give me a comprehensive plan before making code changes.
```

---

## Example Usage

### In ChatGPT/Claude

1. Paste the prompt
2. Upload your CSS files or paste them
3. Review the plan the AI provides
4. Approve and let it refactor
5. Test the output

### In Cursor

1. Open your CSS files
2. Select multiple files with Cmd/Ctrl+Click
3. Open Composer (Cmd+I or Ctrl+I)
4. Paste the prompt
5. Reference your CSS files with @ mentions
6. Let Cursor refactor

### In GitHub Copilot

1. Open the prompt in a comment block
2. Use Copilot Chat to process
3. Apply suggestions file by file

---

## Customization

You can customize the prompt based on your needs:

### Add Specific Design System

```
Additionally, use our design system values:
- Primary color: #4a90e2
- Secondary color: #9b59b6
- Spacing scale: 8px base (0.5rem increments)
- Border radius: 4px, 8px, 16px
```

### Specify Browser Support

```
Target modern evergreen browsers only (Chrome 105+, Firefox 110+, Safari 16+).
No need for fallbacks or legacy browser support.
```

### Add Framework Context

```
This is an Astro project. CSS is scoped per component. Consider:
- Component-level styles
- Global variables in variables.css
- No CSS modules or CSS-in-JS
```

---

## Follow-Up Questions

After the initial refactoring, you can ask:

1. **"Are there any remaining magic values that should be systematized?"**
2. **"Can you identify opportunities to use container queries I missed?"**
3. **"Are there any selectors nested too deeply?"**
4. **"Can you audit for any SASS-style nesting that needs fixing?"**
5. **"Are there repeated patterns that could be abstracted to custom properties?"**

---

## Validation Checklist

After refactoring, verify:

- [ ] No SASS-style nesting (`&--modifier`, child classes nested)
- [ ] All pseudo-selectors use `&:hover`, `&:focus`, etc.
- [ ] Container queries are nested within their elements
- [ ] No magic values (all use custom properties)
- [ ] Custom properties have semantic names
- [ ] Container types are defined where needed
- [ ] Max 3 levels of nesting anywhere
- [ ] All functionality preserved
- [ ] No linter errors
- [ ] Visual regression testing passes

---

## Tips for Best Results

1. **Provide Context**: Share your design system, brand colors, spacing scale
2. **Show Examples**: Include examples of your current CSS
3. **Set Boundaries**: Specify what you want preserved vs. changed
4. **Iterate**: Start with one file, validate approach, then scale
5. **Test Early**: Check output in browser frequently
6. **Version Control**: Commit after each major change

---

## Common Issues & Solutions

### Issue: AI uses SASS-style nesting

**Solution**: Remind it:
```
You're using SASS-style nesting. Use native CSS nesting only.
`&--modifier` is SASS syntax. In native CSS, write separate rules:

.element { }
.element--modifier { }
```

### Issue: Too many custom properties

**Solution**:
```
You've created too many custom properties I won't use.
Focus only on values that appear 3+ times in the codebase.
Don't create a comprehensive system, create what we actually need.
```

### Issue: Container queries everywhere

**Solution**:
```
Be strategic with container queries.
Only use them where the component truly needs to adapt to its container.
Simple components can still use normal CSS.
```

---

## Success Story

This prompt was used to refactor the AllDayTreats project CSS:
- 11 files refactored
- ~1,200 lines updated
- 35+ custom properties created
- 15+ container queries implemented
- 10 media queries replaced
- Zero magic values remaining
- All functionality preserved
- No visual regressions

Time investment: ~2 hours
Long-term maintainability improvement: Significant

---

## Version History

- **v1.0** (2026-01-18): Initial prompt based on AllDayTreats refactoring
