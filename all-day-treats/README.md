# All Day Treats - Astro Site

A component-based, maintainable website for All Day Treats—a local Omaha business specializing in handcrafted candy-coated fruits, chocolate-covered treats, and custom party platters.

## Purpose

This website serves as a digital brochure showcasing All Day Treats' product offerings. It enables customers to discover products, view pricing, customize orders through an interactive cart, and submit orders via email. Built with Astro for optimal performance and maintainability.

## What This Project Is

- **Product Showcase**: Visual menu with interactive cart and checkout
- **Component-Based**: Modular Astro components for surgical changes
- **Content-Driven**: Products managed as markdown files with frontmatter
- **Performance-First**: Leverages Astro's built-in optimizations
- **Zero Backend**: Static site with client-side interactivity
- **Vanilla JavaScript**: No framework overhead, better organized

## What This Project Is Not

- An e-commerce platform (no payment processing)
- A CMS (products updated via markdown files)
- A framework-heavy app (vanilla JS with Astro components)

## Key Features

**Product Menu**: Category filtering, interactive product cards
**Shopping Cart**: Add items, adjust quantities, view totals
**Product Modals**: Select options, add special instructions
**Checkout Flow**: Customer information form with validation
**Email Integration**: Order submission via mailto
**Responsive Design**: Mobile-first, optimized for all devices
**Smooth Animations**: View Transitions API with fallbacks

## Why Astro?

**Performance**: Ships zero JavaScript by default, only hydrates what's needed
**Developer Experience**: Component-based without framework lock-in
**Image Optimization**: Built-in automatic optimization and responsive images
**Content Collections**: Type-safe content management with Zod validation
**Simplicity**: Minimal configuration, smart defaults

## Why Vanilla JavaScript?

**Simplicity**: No framework complexity or learning curve
**Performance**: Zero framework overhead on the client
**Maintainability**: Battle-tested logic, just better organized
**Control**: Full control over behavior without framework abstractions

## Why Global CSS?

**Simplicity**: Clear cascade, no scoped style complexity
**Performance**: Single stylesheet, better caching
**Control**: Not afraid of the cascade when you understand it
**Organization**: BEM-style naming provides clarity

## Technology Stack

- **Astro** (^5.16.11) - Static site generator
- **Vanilla JavaScript** - Client-side interactivity
- **CSS Custom Properties** - Design system
- **Content Collections** - Type-safe product data
- **View Transitions API** - Smooth animations (with fallback)

## Development Principles

Following **Coding with VIBES** standards:

1. **Functional & Declarative**: Function expressions over classes
2. **TypeScript Interfaces**: Strict typing for all data structures
3. **Minimal Abstraction**: Lines of code = debt
4. **Explicit Returns**: Clear function signatures
5. **CSS Mastery**: Embrace the cascade, use custom properties
6. **No Barrel Files**: Explicit imports only

## Documentation

### Getting Started
- [Developer Onboarding](docs/DEVELOPER_ONBOARDING.md) - Setup, workflow, and contribution guide

### Project Vision (30,000ft)
- [Migration Vision](docs/vision/MIGRATION_VISION.md) - Why we migrated to Astro
- [Migration Overview](docs/MIGRATION_OVERVIEW.md) - Quick reference guide
- [Original PRD](../PRD.md) - Initial product requirements

### Architecture (15,000ft)
- [Migration Roadmap](docs/architecture/MIGRATION_ROADMAP.md) - Step-by-step migration plan

### Standards
- [Coding with VIBES](../docs/coding_with_vibes/README.md) - Development methodology

## Deployment

Built as a static site with zero backend requirements. Can be deployed to any static hosting provider with zero monthly costs.

## License

Private project - All rights reserved.

---

**Built with ❤️ for All Day Treats, Omaha NE**
