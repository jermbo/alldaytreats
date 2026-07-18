# SKU System Documentation

This document provides a comprehensive overview of the SKU (Stock Keeping Unit) system implemented in the AllDayTreats platform. SKUs are used for product identification, order verification, and inventory management.

## Table of Contents

- [Overview](#overview)
- [SKU Naming Convention](#sku-naming-convention)
- [Product SKUs](#product-skus)
- [Topping SKUs](#topping-skus)
- [Pricing Structure](#pricing-structure)
- [Technical Implementation](#technical-implementation)
- [Order Verification](#order-verification)

## Overview

The SKU system provides unique identifiers for:

- **Product Variants**: Each product with different quantities (6ct, 8ct, 12ct) has a unique SKU
- **Toppings/Add-ons**: Each topping option has a unique SKU identifier
- **Order Verification**: SKUs are included in order emails to verify pricing and product details

All SKUs are currently active and available for use in the system.

## SKU Naming Convention

### Product SKUs

Product SKUs follow the pattern: `[Product Code][Quantity]`

- **Product Code**: 2-4 letter abbreviation representing the product
- **Quantity**: 2-digit number representing the count (06, 08, 12) or package size code

**Examples:**

- `CG06` = Candy Grapes, 6 count
- `CCS12` = Chocolate Covered Strawberries, 12 count
- `CCT08` = Classic Chocolate Trio package
- `BBL06` = Berry Blast package

### Topping SKUs

Topping SKUs are 4-letter uppercase codes representing the topping name:

- `JYRS` = Jolly Ranchers
- `NERD` = Nerds
- `STRB` = Starburst
- `SKTL` = Skittles
- `AHDS` = Airheads
- `CDSA` = Candy Sauce
- `FRUP` = Fruit Rollup

## Product SKUs

### Candy Coated Products

| SKU     | Product Name                 | Quantity | Price  | Category |
| ------- | ---------------------------- | -------- | ------ | -------- |
| `CG06`  | Candy Grapes                 | 6ct      | $15.00 | candy    |
| `CG08`  | Candy Grapes                 | 8ct      | $18.00 | candy    |
| `CG12`  | Candy Grapes                 | 12ct     | $20.00 | candy    |
| `CS06`  | Candy Strawberries           | 6ct      | $15.00 | candy    |
| `CS08`  | Candy Strawberries           | 8ct      | $18.00 | candy    |
| `CS12`  | Candy Strawberries           | 12ct     | $20.00 | candy    |
| `CPR06` | Candy Pineapple Rings/Chunks | 6ct      | $15.00 | candy    |
| `CPR08` | Candy Pineapple Rings/Chunks | 8ct      | $20.00 | candy    |
| `CPR12` | Candy Pineapple Rings/Chunks | 12ct     | $30.00 | candy    |

**Total Candy Coated SKUs:** 9

### Chocolate Covered Products

| SKU      | Product Name                    | Quantity | Price  | Category  |
| -------- | ------------------------------- | -------- | ------ | --------- |
| `CCS06`  | Chocolate Covered Strawberries  | 6ct      | $12.00 | chocolate |
| `CCS08`  | Chocolate Covered Strawberries  | 8ct      | $15.00 | chocolate |
| `CCS12`  | Chocolate Covered Strawberries  | 12ct     | $20.00 | chocolate |
| `CP06`   | Cake Pops / Cakesicles          | 6ct      | $13.00 | chocolate |
| `CP08`   | Cake Pops / Cakesicles          | 8ct      | $17.00 | chocolate |
| `CP12`   | Cake Pops / Cakesicles          | 12ct     | $27.00 | chocolate |
| `CCO06`  | Chocolate Covered Oreos         | 6ct      | $10.00 | chocolate |
| `CCO08`  | Chocolate Covered Oreos         | 8ct      | $15.00 | chocolate |
| `CCO12`  | Chocolate Covered Oreos         | 12ct     | $20.00 | chocolate |
| `CCP06`  | Chocolate Covered Pretzels      | 6ct      | $12.00 | chocolate |
| `CCP08`  | Chocolate Covered Pretzels      | 8ct      | $15.00 | chocolate |
| `CCP12`  | Chocolate Covered Pretzels      | 12ct     | $20.00 | chocolate |
| `CCRK06` | Chocolate Covered Rice Krispies | 6ct      | $15.00 | chocolate |
| `CCRK08` | Chocolate Covered Rice Krispies | 8ct      | $20.00 | chocolate |
| `CCRK12` | Chocolate Covered Rice Krispies | 12ct     | $25.00 | chocolate |

**Total Chocolate Covered SKUs:** 15

### Party Packages

| SKU     | Product Name           | Includes                                       | Price   | Category |
| ------- | ---------------------- | ---------------------------------------------- | ------- | -------- |
| `CCT08` | Classic Chocolate Trio | Strawberries, Rice Krispies, Oreos (8ct each)  | $85.00  | platter  |
| `SSM08` | Sweet & Salty Mix      | Strawberries, pretzels, Oreos (8ct each)       | $75.00  | platter  |
| `DTS08` | Dessert Table Starter  | Cake pops, Oreos, Rice Krispies (8ct each)     | $80.00  | platter  |
| `SLB06` | Strawberry Lover's Box | Strawberries, pretzels (6ct) + breakable heart | $50.00  | platter  |
| `COL08` | Chocolate Overload     | All 5 chocolate items (8ct each)               | $130.00 | platter  |
| `CCR08` | Candy Crazeee          | Grapes, strawberries, pineapple (8ct each)     | $85.00  | platter  |
| `BBL06` | Berry Blast            | Grapes + strawberries (6ct each)               | $45.00  | platter  |
| `TCB08` | Tropical Candy Box     | Pineapple + grapes (8ct each)                  | $75.00  | platter  |
| `CFD12` | Candy Fruit Deluxe     | 12ct grapes, 12ct strawberries, 6ct pineapple  | $100.00 | platter  |

**Total Package SKUs:** 9

### Summary

- **Total Product SKUs:** 33
- **Candy Coated:** 9 SKUs (3 products × 3 variants)
- **Chocolate Covered:** 15 SKUs (5 products × 3 variants)
- **Party Packages:** 9 SKUs

## Topping SKUs

All toppings are currently available and can be added to products (maximum 2 toppings per product).

| SKU    | Topping Name   | Base Price (6ct) | 8ct Price | 12ct Price | Available |
| ------ | -------------- | ---------------- | --------- | ---------- | --------- |
| `JYRS` | Jolly Ranchers | $2.00            | $3.00     | $4.00      | ✓         |
| `NERD` | Nerds          | $2.00            | $3.00     | $4.00      | ✓         |
| `STRB` | Starburst      | $2.00            | $3.00     | $4.00      | ✓         |
| `SKTL` | Skittles       | $2.00            | $3.00     | $4.00      | ✓         |
| `AHDS` | Airheads       | $2.00            | $3.00     | $4.00      | ✓         |
| `CDSA` | Candy Sauce    | $1.00            | $2.00     | $3.00      | ✓         |
| `FRUP` | Fruit Rollup   | $5.00            | $6.00     | $7.00      | ✓         |

**Total Topping SKUs:** 7

### Topping Pricing Formula

Topping prices scale based on the product quantity:

- **6ct products**: Base price
- **8ct products**: Base price + $1.00
- **12ct products**: Base price + $2.00

**Note:** Party packages use flat base topping prices (no quantity scaling). A la carte candy products still scale by count.

## Pricing Structure

### Product Pricing

Products have fixed prices per quantity variant:

- Most products offer 6ct, 8ct, and 12ct options
- Platters offer 1ct, 2ct, and 3ct options
- Prices increase with quantity, but pricing is not uniform across products

### Topping Pricing

Topping prices are dynamic based on the product quantity:

- Base prices range from $1.00 to $5.00
- Prices increase by $1.00 for 8ct products
- Prices increase by $2.00 for 12ct products

## Technical Implementation

### Product SKUs

Product SKUs are defined in product markdown files located at:

```
src/content/products/
```

Each product file contains:

- Product name
- Category (candy, chocolate, platter)
- Image path
- Price options array with `count`, `price`, and `sku` fields

**Example:**

```yaml
priceOptions:
  - count: 6
    price: 15
    sku: CG06
  - count: 8
    price: 18
    sku: CG08
  - count: 12
    price: 20
    sku: CG12
```

### Topping SKUs

Topping SKUs are defined in:

```
src/config/toppings.ts
```

Each topping object contains:

- `id`: Internal identifier (kebab-case)
- `name`: Display name
- `price`: Base price for 6ct products
- `available`: Boolean flag
- `sku`: Unique SKU identifier

**Example:**

```typescript
{
  id: "jolly-ranchers",
  name: "Jolly Ranchers",
  price: 2,
  available: true,
  sku: "JYRS",
}
```

### SKU Usage in Code

SKUs are used in several places:

1. **Cart Management** (`src/scripts/cart.js`):
   - Items are stored with their SKU
   - Cart item IDs are generated using SKU prefix: `[sku]-[id]`

2. **Order Emails** (`src/scripts/checkout-ui.js`):
   - Product SKUs are included in order line items: `Product Name [SKU]`
   - Topping SKUs are included: `Topping Name [SKU] (+$price)`

3. **Product Selection** (`src/scripts/product-modal.js`):
   - SKUs are attached to selected price options
   - SKUs are passed to cart when items are added

## Order Verification

SKUs are included in order confirmation emails to enable verification of:

- Product selection (correct product and quantity)
- Pricing accuracy (prevent tampering)
- Topping selection and pricing

### Example Order Line

```
1. Candy Strawberries [CS08] - 8ct × 1
   Price: $24.00
   Toppings: Nerds [NERD] (+$3), Starburst [STRB] (+$3)
```

### Verification Steps

1. **Verify Product SKU**: Match `[CS08]` against product SKU table
   - `CS08` = Candy Strawberries, 8ct = $18.00 ✓

2. **Verify Topping SKUs**: Match `[NERD]` and `[STRB]` against topping SKU table
   - `NERD` (8ct) = $3.00 ✓
   - `STRB` (8ct) = $3.00 ✓

3. **Calculate Total**: $18.00 + $3.00 + $3.00 = $24.00 ✓

## Quick Reference

### Product Code Abbreviations

| Code | Product                         |
| ---- | ------------------------------- |
| CG   | Candy Grapes                    |
| CS   | Candy Strawberries              |
| CPR  | Candy Pineapple Rings/Chunks    |
| CCS  | Chocolate Covered Strawberries  |
| CP   | Cake Pops / Cakesicles          |
| CCO  | Chocolate Covered Oreos         |
| CCP  | Chocolate Covered Pretzels      |
| CCRK | Chocolate Covered Rice Krispies |
| CCT  | Classic Chocolate Trio          |
| SSM  | Sweet & Salty Mix               |
| DTS  | Dessert Table Starter           |
| SLB  | Strawberry Lover's Box          |
| COL  | Chocolate Overload              |
| CCR  | Candy Crazeee                   |
| BBL  | Berry Blast                     |
| TCB  | Tropical Candy Box              |
| CFD  | Candy Fruit Deluxe              |

### Quantity Codes

| Code | Quantity |
| ---- | -------- |
| 06   | 6 count  |
| 08   | 8 count  |
| 12   | 12 count |

---

**Last Updated:** July 15, 2026
**Total SKUs:** See [Sku_Reference.md](Sku_Reference.md) for the full package, theme, flavor, and fee reference.
