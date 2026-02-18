# Checkout Flow Documentation

This document describes the checkout flow for placing orders on AllDayTreats.

## Overview

The checkout process uses a **3-step centered modal** that guides users through submitting their order via email. The modal is non-dismissable (cannot be closed by clicking outside or pressing ESC) to prevent accidental closures during the checkout process.

## Flow Diagram

```
Cart Panel
    │
    │ [Place Order]
    ▼
┌─────────────────────────────────┐
│ Step 1: Customer Information    │
│                                 │
│ • Order Summary                 │
│ • Pickup/Delivery Selection     │
│ • Name, Email, Phone            │
│ • Zip Code & Address (Delivery) │
│ • Optional Notes                │
│                                 │
│ [Cancel]              [Continue]│
└─────────────────────────────────┘
    │
    │ Form validated
    ▼
┌─────────────────────────────────┐
│ Step 2: Email Instructions      │
│                                 │
│ "Send an email to:              │
│  alldaytreat@gmail.com"         │
│                                 │
│ [Copy Order Details]            │
│ [Open Email Client]             │
│                                 │
│ ⚠️ Warning: Confirming clears   │
│    cart without placing order   │
│    if email was not sent.       │
│                                 │
│ [Confirm Order Has Been Sent]   │
│                                 │
│ [Back]                          │
└─────────────────────────────────┘
    │
    │ [Confirm Order Sent]
    ▼
┌─────────────────────────────────┐
│ Step 3: Success                 │
│                                 │
│ ✓ Thank You!                    │
│                                 │
│ "Your order has been submitted  │
│  via email."                    │
│                                 │
│ Disclaimer about email          │
│                                 │
│ Closing in 5 seconds...         │
│                                 │
│ [Close Now]                     │
└─────────────────────────────────┘
    │
    │ Auto-close (5s) or manual
    ▼
Cart Panel (empty)
```

## Step Details

### Step 1: Customer Information

**Purpose:** Collect customer contact information and order type (pickup or delivery).

**Fields:**
| Field | Required | Validation |
|-------|----------|------------|
| Order Type (Pickup/Delivery) | Yes | Must select pickup or delivery |
| Full Name | Yes | Non-empty |
| Email Address | Yes | Valid email format |
| Phone Number | Yes | (XXX) XXX-XXXX format |
| Delivery Zip Code | Yes (Delivery only) | Must select from dropdown (valid delivery area) |
| Delivery Address | Yes (Delivery only) | Minimum 10 characters |
| Order Notes | No | Max 500 characters |

**Features:**

- Order summary displayed at top showing all cart items with subtotal, pickup/delivery fee, and total
- **Pickup/Delivery Selection**: Radio buttons at the top allow users to choose between pickup and delivery
  - **Pickup**: Default selection. Hides zip code and address fields. No delivery fee ($0.00).
  - **Delivery**: Shows zip code and address fields (required). Calculates delivery fee based on selected zip code.
- Delivery fee calculated automatically based on selected zip code (delivery orders only)
- Zip code dropdown populated with available delivery areas and fees (shown only for delivery orders)
- Real-time validation on blur
- Submit button disabled until all required fields are valid
- Conditional field display: zip code and address fields are hidden when pickup is selected
- Spam prevention measures (see [Spam Prevention](#spam-prevention) section)

**Actions:**

- **Cancel** - Closes modal, returns to cart (cart preserved)
- **Continue** - Validates form, proceeds to Step 2

### Step 2: Email Instructions

**Purpose:** Guide the user through sending their order via email.

**Display:**

- Business email address prominently displayed
- Order preview showing the formatted email content
- Clear instructions for sending the order

**Actions:**

- **Copy Order Details** - Copies formatted order text to clipboard, shows "Copied!" feedback
- **Open Email Client** - Opens default email client with pre-filled subject and body. Also copies to clipboard as fallback in case email client doesn't open.
- **Confirm Order Has Been Sent** - Proceeds to success step. Includes prominent warning that clicking this without actually sending the email will NOT place the order.
- **Back** - Returns to Step 1 to edit information

### Step 3: Success Confirmation

**Purpose:** Confirm the order process is complete and provide final instructions.

**Display:**

- Success icon with animation
- Thank you message
- Disclaimer: "If you did not send the email, your order was not placed"
- Countdown timer (5 seconds)

**Behavior:**

- Cart is cleared when entering this step
- Form is reset
- Modal auto-closes after 5 seconds
- User can click "Close Now" to close immediately

## Technical Implementation

### Files

| File                                      | Purpose                                                                 |
| ----------------------------------------- | ----------------------------------------------------------------------- |
| `src/components/CheckoutPanel.astro`      | Modal HTML structure with 3 step containers                             |
| `src/styles/checkout.css`                 | Centered modal styles, step transitions                                 |
| `src/styles/form-validation.css`          | Form input validation states                                            |
| `src/scripts/checkout-ui.ts`              | Modal logic, step management, email functions, pickup/delivery handling |
| `src/scripts/validation-ui.ts`            | Error display utilities                                                 |
| `src/scripts/validation.ts`               | Validation functions (conditional for pickup/delivery)                  |
| `src/scripts/phone-formatter.ts`          | Phone number formatting                                                 |
| `src/scripts/checkout/order-formatter.ts` | Formats order email (handles pickup vs delivery)                        |
| `src/config/delivery.ts`                  | Delivery zone configuration and fee lookup                              |

### State Management

```javascript
// Modal state
let currentStep = "info"; // "info" | "instructions" | "success"
let formattedOrderText = ""; // Pre-formatted order for clipboard/email
let orderId = ""; // Generated unique order ID
let autoCloseTimer = null; // Timer for auto-close on success
let countdownInterval = null; // Interval for countdown display
let deliveryType = "pickup"; // "pickup" | "delivery" (default: "pickup")
let selectedDeliveryFee = null; // Delivery fee based on selected zip code (null for pickup)
```

### Key Functions

| Function                           | Description                                                |
| ---------------------------------- | ---------------------------------------------------------- |
| `openCheckout()`                   | Opens modal, resets to Step 1, renders order summary       |
| `closeCheckout()`                  | Closes modal, clears timers                                |
| `goToStep(step)`                   | Navigates to specified step                                |
| `handleFormSubmit(e)`              | Validates form, generates order text, goes to Step 2       |
| `setupDeliveryTypeSelection()`     | Initializes pickup/delivery radio button handlers          |
| `handleDeliveryTypeChange()`       | Handles pickup/delivery selection changes                  |
| `updateDeliveryFieldsVisibility()` | Shows/hides zip code and address fields based on selection |
| `populateZipCodeDropdown()`        | Populates zip code dropdown with delivery options          |
| `handleZipCodeChange()`            | Updates delivery fee when zip code changes                 |
| `updateDeliveryDisplay()`          | Updates pickup/delivery fee and total in order summary     |
| `copyOrderToClipboard(btn)`        | Copies order text to clipboard                             |
| `openEmailClient()`                | Opens mailto: link, copies to clipboard as backup          |
| `confirmOrderSent()`               | Clears cart, goes to Step 3                                |
| `startAutoCloseCountdown()`        | Starts 5-second countdown with auto-close                  |

### Email Format

The order is formatted as plain text for email. The format differs based on whether the order is pickup or delivery:

**Delivery Order Format:**

```
Treat Order #[8-char-id]

Name - [Customer Name]
Email - [Customer Email]
Phone - [Customer Phone]
Zip Code - [Selected Zip Code]
Address - [Customer Address]
Special Instructions - [Notes if any]

------
Order:
------

1. [Product Name] - [count]ct × [quantity]
   SKU: [product variant SKU]
   Price: $[line total]
   Toppings: [topping names with prices]
   Notes: [item notes if any]

------
Subtotal: $[subtotal]
Delivery: $[delivery fee]
------
Total: $[total]
------
```

**Pickup Order Format:**

```
Treat Order #[8-char-id]

Name - [Customer Name]
Email - [Customer Email]
Phone - [Customer Phone]
Pickup - Yes
Special Instructions - [Notes if any]

------
Order:
------

1. [Product Name] - [count]ct × [quantity]
   SKU: [product variant SKU]
   Price: $[line total]
   Toppings: [topping names with prices]
   Notes: [item notes if any]

------
Subtotal: $[subtotal]
Pickup: $0.00
------
Total: $[total]
------
```

### Pickup/Delivery System

The checkout form allows users to choose between pickup and delivery:

- **Order Type Selection**: Radio buttons at the top of the form let users select "Pickup" (default) or "Delivery"
- **Pickup Orders**:
  - No zip code or address fields required
  - No delivery fee ($0.00)
  - Order summary shows "Pickup: $0.00"
  - Email format shows "Pickup - Yes" instead of address information
- **Delivery Orders**:
  - Zip code and address fields are required and visible
  - **Zip Code Selection**: Users must select their delivery zip code from a dropdown populated with available delivery areas
  - **Dynamic Pricing**: Delivery fee is calculated automatically based on the selected zip code
  - Order summary shows "Delivery: $[fee]"
- **Order Summary**: The order summary displays:
  - Subtotal (cart items total)
  - Pickup/Delivery fee (Pickup: $0.00, Delivery: based on zip code)
  - Total (subtotal + fee)
- **Real-time Updates**:
  - When switching between pickup/delivery, fields show/hide accordingly
  - When a zip code is selected (delivery), the delivery fee and total update immediately in the order summary
- **Configuration**: Delivery zones and fees are configured in `src/config/delivery.ts` and `src/config/site.ts`

The pickup/delivery fee is included in the order email and added to the total order amount.

### SKU Verification

Each product variant and topping has a unique SKU for order verification. The business can use these SKUs to verify that customers haven't altered pricing or product/topping details in the email.

For the complete SKU reference with all products, quantities, and prices, see **[Sku_Reference.md](Sku_Reference.md)**.

## UX Decisions

### Non-Dismissable Modal

The modal cannot be closed by clicking the backdrop or pressing ESC. This prevents users from accidentally losing their form data during checkout. Only the Cancel button (Step 1) or Close Now button (Step 3) can close the modal.

### Copy + Email Fallback

The "Open Email Client" button also copies to clipboard. This handles cases where:

- User's email client doesn't open (no default set)
- mailto: link fails silently
- User wants to use a web-based email client

### Explicit Confirmation

Users must explicitly click "Confirm Order Has Been Sent" with a visible warning. This ensures they understand that:

1. The system cannot verify if the email was actually sent
2. Clicking confirm without sending the email will only clear their cart
3. They are responsible for actually sending the email

### Auto-Close with Countdown

The success screen auto-closes after 5 seconds to return the user to browsing. The visible countdown:

- Sets expectations for the user
- Allows them to close sooner if desired
- Gives time to read the disclaimer

## Spam Prevention

The checkout form includes two layers of bot detection. These are intentionally undocumented in code comments to avoid detection by bots that parse source code.

### Layer 1: Hidden Field

A visually hidden form field (`#checkout-website`) is included in the form. Real users cannot see or interact with it due to CSS. Bots that fill all form fields will populate this field, triggering rejection.

**Implementation details:**

- Field uses `name="website"` to appear as a legitimate optional field
- Hidden using `clip-path` technique rather than `display: none` (which bots commonly detect)
- CSS class uses generic naming (`--alt` modifier) to avoid detection
- No inline comments in HTML/CSS/JS that reveal its purpose

### Layer 2: Timing Validation

A hidden timestamp field (`#checkout-form-ts`) records when the form was opened. Submissions that occur in under 3 seconds are rejected.

**Rationale:** Humans need time to read and fill a form. Bots typically submit instantly.

### Rejection Behavior

Both checks fail silently with an early `return` - no error messages, console warnings, or user feedback. This prevents attackers from knowing which check they failed.

### Future Considerations

If bot attacks increase, consider:

- Rate limiting by IP (requires server-side implementation)
- CAPTCHA integration (last resort - impacts UX)
- Additional timing checks (e.g., detecting fields filled too uniformly)

## Accessibility

- Modal has `role="dialog"` and `aria-modal="true"`
- All form fields have associated labels and `aria-describedby` for errors
- Error messages use `role="alert"` and `aria-live="polite"`
- Focus is managed when navigating between steps
- Required fields marked with `aria-required="true"`
- Button states properly disabled when actions unavailable
