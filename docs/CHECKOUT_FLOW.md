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
│ • Name, Email, Phone, Address   │
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
│  alldaytreats@gmail.com"        │
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

**Purpose:** Collect customer contact and delivery information.

**Fields:**
| Field | Required | Validation |
|-------|----------|------------|
| Full Name | Yes | Non-empty |
| Email Address | Yes | Valid email format |
| Phone Number | Yes | (XXX) XXX-XXXX format |
| Delivery Address | Yes | Minimum 10 characters |
| Order Notes | No | Max 500 characters |

**Features:**
- Order summary displayed at top showing all cart items
- Real-time validation on blur
- Submit button disabled until all required fields are valid
- Honeypot field for spam prevention

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

| File | Purpose |
|------|---------|
| `src/components/CheckoutPanel.astro` | Modal HTML structure with 3 step containers |
| `src/styles/checkout.css` | Centered modal styles, step transitions |
| `src/styles/form-validation.css` | Form input validation states |
| `src/scripts/checkout-ui.js` | Modal logic, step management, email functions |
| `src/scripts/validation-ui.js` | Error display utilities |
| `src/scripts/validation.js` | Validation functions |
| `src/scripts/phone-formatter.js` | Phone number formatting |

### State Management

```javascript
// Modal state
let currentStep = "info";      // "info" | "instructions" | "success"
let formattedOrderText = "";   // Pre-formatted order for clipboard/email
let orderId = "";              // Generated unique order ID
let autoCloseTimer = null;     // Timer for auto-close on success
let countdownInterval = null;  // Interval for countdown display
```

### Key Functions

| Function | Description |
|----------|-------------|
| `openCheckout()` | Opens modal, resets to Step 1, renders order summary |
| `closeCheckout()` | Closes modal, clears timers |
| `goToStep(step)` | Navigates to specified step |
| `handleFormSubmit(e)` | Validates form, generates order text, goes to Step 2 |
| `copyOrderToClipboard(btn)` | Copies order text to clipboard |
| `openEmailClient()` | Opens mailto: link, copies to clipboard as backup |
| `confirmOrderSent()` | Clears cart, goes to Step 3 |
| `startAutoCloseCountdown()` | Starts 5-second countdown with auto-close |

### Email Format

The order is formatted as plain text for email:

```
Treat Order #[8-char-id]

Name - [Customer Name]
Email - [Customer Email]
Phone - [Customer Phone]
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
Subtotal: $[total]
------
```

### SKU Verification

Each product variant and topping has a unique SKU for order verification. The business can use these SKUs to verify that customers haven't altered pricing or product/topping details in the email.

For the complete SKU reference with all products, quantities, and prices, see **[SKU_REFERENCE.md](SKU_REFERENCE.md)**.

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

## Accessibility

- Modal has `role="dialog"` and `aria-modal="true"`
- All form fields have associated labels and `aria-describedby` for errors
- Error messages use `role="alert"` and `aria-live="polite"`
- Focus is managed when navigating between steps
- Required fields marked with `aria-required="true"`
- Button states properly disabled when actions unavailable
