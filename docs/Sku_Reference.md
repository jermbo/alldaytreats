# SKU Reference Guide

This document provides a complete reference of all product and topping SKUs for order verification.

## Products

### Candy Coated

| SKU | Name | Quantity | Price |
|-----|------|----------|-------|
| CG06 | Candy Grapes | 6ct | $15.00 |
| CG08 | Candy Grapes | 8ct | $18.00 |
| CG12 | Candy Grapes | 12ct | $20.00 |
| CS06 | Candy Strawberries | 6ct | $15.00 |
| CS08 | Candy Strawberries | 8ct | $18.00 |
| CS12 | Candy Strawberries | 12ct | $20.00 |
| CPR06 | Candy Pineapple Rings/Chunks | 6ct | $15.00 |
| CPR08 | Candy Pineapple Rings/Chunks | 8ct | $20.00 |
| CPR12 | Candy Pineapple Rings/Chunks | 12ct | $30.00 |

### Chocolate Covered

| SKU | Name | Quantity | Price |
|-----|------|----------|-------|
| CCS06 | Chocolate Covered Strawberries | 6ct | $12.00 |
| CCS08 | Chocolate Covered Strawberries | 8ct | $15.00 |
| CCS12 | Chocolate Covered Strawberries | 12ct | $20.00 |
| CP06 | Cake Pops / Cakesicles | 6ct | $13.00 |
| CP08 | Cake Pops / Cakesicles | 8ct | $17.00 |
| CP12 | Cake Pops / Cakesicles | 12ct | $27.00 |
| CCO06 | Chocolate Covered Oreos | 6ct | $10.00 |
| CCO08 | Chocolate Covered Oreos | 8ct | $15.00 |
| CCO12 | Chocolate Covered Oreos | 12ct | $20.00 |
| CCP06 | Chocolate Covered Pretzels | 6ct | $12.00 |
| CCP08 | Chocolate Covered Pretzels | 8ct | $15.00 |
| CCP12 | Chocolate Covered Pretzels | 12ct | $20.00 |
| CCRK06 | Chocolate Covered Rice Krispies | 6ct | $15.00 |
| CCRK08 | Chocolate Covered Rice Krispies | 8ct | $20.00 |
| CCRK12 | Chocolate Covered Rice Krispies | 12ct | $25.00 |

### Party Packages (Chocolate)

| SKU | Name | Includes | Price |
|-----|------|----------|-------|
| CCT08 | Classic Chocolate Trio | Strawberries, Rice Krispies, Oreos (8ct each) | $85.00 |
| SSM08 | Sweet & Salty Mix | Strawberries, pretzels, Oreos (8ct each) | $75.00 |
| DTS08 | Dessert Table Starter | Cake pops, Oreos, Rice Krispies (8ct each) | $80.00 |
| SLB06 | Strawberry Lover's Box | Strawberries, pretzels (6ct) + 1 breakable heart | $50.00 |
| COL08 | Chocolate Overload | All 5 chocolate items (8ct each) | $130.00 |

### Party Packages (Candy Fruit)

| SKU | Name | Includes | Price |
|-----|------|----------|-------|
| CCR08 | Candy Crazeee | Grapes, strawberries, pineapple (8ct each) | $85.00 |
| BBL06 | Berry Blast | Grapes + strawberries (6ct each) | $45.00 |
| TCB08 | Tropical Candy Box | Pineapple + grapes (8ct each) | $75.00 |
| CFD12 | Candy Fruit Deluxe | 12ct grapes, 12ct strawberries, 6ct pineapple | $100.00 |

Candy fruit packages require at least one flavor. First flavor included; each additional flavor +$1 (`XFLV`).

## Themes (Packages)

Optional theme upcharge: **$20** per package.

| SKU | Theme |
|-----|-------|
| THTS | Toy Story |
| THSC | School |
| THBD | Birthday (any age) |
| THWP | Winnie the Pooh |
| THMM | Mickey Mouse |
| THMN | Minions |
| THCC | Cookies and Cream |
| THSS | Strawberry Shortcake |
| THCW | Cow |
| THHL | Holiday |
| THBS | Baby Shower |
| THSP | Sports Team / Organization |
| THCU | Custom / Other |

## Flavors (Candy Fruit Packages)

| SKU | Flavor |
|-----|--------|
| FLST | Strawberry |
| FLWM | Watermelon |
| FLGA | Green Apple |
| FLGR | Grape |
| FLCH | Cherry |
| FLBR | Blue Raspberry |
| FLCC | Cotton Candy |
| FLFP | Fruit Punch |

| SKU | Fee |
|-----|-----|
| XFLV | Extra flavor (+$1 each after the first) |

## Order Fees

| SKU | Fee | Amount |
|-----|-----|--------|
| RUSH | Rush (sooner than 1 week) | $15.00 |

## Toppings / Add-Ons

### A la carte candy products

Topping prices vary based on product quantity:
- **6ct**: Base price
- **8ct**: Base price + $1
- **12ct**: Base price + $2

### Packages

Package add-ons use **flat base prices** (no quantity scaling). Max 2 add-ons.

| SKU | Name | Base / Package Price | 8ct (a la carte) | 12ct (a la carte) |
|-----|------|----------------------|------------------|-------------------|
| JYRS | Jolly Ranchers | $2.00 | $3.00 | $4.00 |
| NERD | Nerds | $2.00 | $3.00 | $4.00 |
| STRB | Starburst | $2.00 | $3.00 | $4.00 |
| SKTL | Skittles | $2.00 | $3.00 | $4.00 |
| AHDS | Airheads | $2.00 | $3.00 | $4.00 |
| CDSA | Candy Sauce | $1.00 | $2.00 | $3.00 |
| FRUP | Fruit Rollup | $5.00 | $6.00 | $7.00 |

## How to Verify Orders

When you receive an order email, each line item will include:
1. **Product SKU** - Match against the Products tables above
2. **Theme / Flavor SKUs** - Match against Themes and Flavors tables
3. **Topping SKUs** - Match against the Toppings table above
4. **Rush Fee** - `[RUSH]` if selected
5. **Prices** - Verify the price matches the SKU + upcharges

Example package line:
```
1. Candy Crazeee [CCR08] - Package × 1
   Price: $108.00
   Theme: Birthday (any age) [THBD] (+$20)
   Flavors: Strawberry [FLST], Grape [FLGR] (+$1 extra flavors)
   Toppings: Nerds [NERD] (+$2)
```

To verify:
- [CCR08] = Candy Crazeee = $85.00
- Theme [THBD] = $20.00
- Extra flavor = $1.00
- [NERD] (package flat) = $2.00
- Total: $85 + $20 + $1 + $2 = $108.00 ✓
