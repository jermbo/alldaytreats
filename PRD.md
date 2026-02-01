# Product Requirements Document (PRD)

## Purpose

All Day Treats is a small, local business specializing in handcrafted candy-coated fruits, chocolate-covered treats, and custom party platters. This website serves as a digital brochure that showcases the business offerings, making it easy for customers to discover products and initiate orders through direct contact.

The website solves the problem of visibility and accessibility for a word-of-mouth business transitioning to social media growth. It provides a professional, mobile-friendly presence that allows potential customers to browse the menu, understand pricing, and contact the business to place custom orders.

---

## Target Audience

### Primary Users

**Individual Customers**

- People looking for treats for personal occasions (birthdays, parties, celebrations, gifts)
- Social media followers discovering the business organically
- Word-of-mouth referrals seeking more information
- Local customers searching for custom treat options

### User Goals

- Quickly understand what products are available
- See pricing and customization options
- Easily contact the business to place orders
- View product images to make informed decisions

### Business Goals

- Establish professional online presence
- Reduce friction in the discovery-to-order process
- Support organic growth through social media
- Maintain low operational costs (minimal tech stack, no monthly bills)

---

## Goals

### Primary Goals

1. **Showcase Products**: Display all menu items with clear categories (Candy Coated, Chocolate Covered, Platters)
2. **Provide Contact Information**: Make it easy for customers to reach out via email or Instagram
3. **Communicate Order Process**: Clearly explain ordering requirements (deposits, payment methods, lead times)
4. **Mobile-First Experience**: Ensure the site works beautifully on mobile devices where most social media traffic originates

### Implemented Features (Added Post-Launch)

- ✅ Shopping cart with localStorage persistence
- ✅ Product modal with quantity selection and toppings
- ✅ Checkout form with validation
- ✅ Email-based order submission via mailto

### Future Goals (Out of Scope)

- Order tracking or confirmation system
- Online payment processing
- User accounts

---

## Success Criteria

### Business Metrics

- **Visibility**: Website serves as the primary landing point from social media profiles
- **Engagement**: Customers can easily find and understand product offerings
- **Conversion**: Contact information is accessible and order process is clear
- **Cost Efficiency**: Zero monthly hosting/operational costs (static site hosting)

### User Experience Metrics

- **Clarity**: New visitors understand what All Day Treats offers within 10 seconds
- **Accessibility**: Contact information is visible and easy to use on all devices
- **Performance**: Site loads quickly on mobile networks
- **Discoverability**: Products are easy to browse and filter by category

---

## High-Level Scope

### In Scope (Current Version)

- **Product Menu Display**: Showcase all treat categories with images, descriptions, and starting prices
- **Category Filtering**: Allow users to filter by "All Treats", "Candy Coated", "Chocolate Covered", or "Platters"
- **Contact Information**: Prominent display of email and Instagram links
- **Order Information**: Clear explanation of ordering process, deposits, and payment methods
- **Responsive Design**: Mobile-first, works on all device sizes
- **Performance**: Fast loading, optimized images, minimal JavaScript

### Out of Scope (Future Versions)

- Online ordering system
- Payment processing
- Shopping cart functionality
- User accounts or order history
- Inventory management
- Backend services or databases
- Real-time order tracking

---

## Key Features

---

## Technical Constraints

### Must-Have Constraints

- **Zero Monthly Costs**: Static site hosting only (no backend, no databases, no serverless functions)
- **Modern Tech Stack**: Astro static site generator, Vanilla JavaScript, Modern CSS
- **Fast Performance**: Optimized for mobile networks and slow connections
- **No External Dependencies**: Avoid third-party services that require API keys or subscriptions

---

## Non-Functional Requirements

### Performance

- Page load time under 2 seconds on 3G connection
- Optimized images (lazy loading, appropriate formats)
- Minimal JavaScript bundle size

### Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader compatibility

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Graceful degradation for older browsers
- View Transitions API with fallback

### Mobile Experience

- Touch-friendly interface
- Responsive design
- Fast tap interactions
- Readable text without zooming

---

## Assumptions

1. Customers will primarily discover the site through social media (Instagram) or word-of-mouth
2. Orders will be placed via direct contact (email, Instagram DM)
3. Business owner will handle all order management manually
4. Product catalog is relatively stable (changes infrequently)
5. No need for real-time inventory or availability

---

## Resolved Decisions

1. ✅ **Cart Implementation**: Client-side cart with localStorage, email-based order submission
2. ✅ **Product Updates**: Markdown files in `src/content/products/` - easy to edit
3. ✅ **Tech Stack**: Migrated from Vite to Astro for better content management

## Open Questions

1. **Analytics**: Should we add basic analytics? (Privacy-focused, no external services)
2. **SEO**: What keywords should we optimize for? (Local searches)

---

## Related Documents

- [README.md](README.md) - Project overview and setup instructions
- [Project Status](docs/Project_Status.md) - Current project status
- [Testing Checklist](docs/Testing_Checklist.md) - QA testing guide
- [Deployment Guide](docs/Deployment.md) - Deployment instructions
