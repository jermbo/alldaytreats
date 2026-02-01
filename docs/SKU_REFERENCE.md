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

### Platters

| SKU | Name | Quantity | Price |
|-----|------|----------|-------|
| PP01 | Party Platter | 1ct | $50.00 |
| PP02 | Party Platter | 2ct | $60.00 |
| PP03 | Party Platter | 3ct | $80.00 |

## Toppings / Add-Ons

Topping prices vary based on product quantity:
- **6ct**: Base price
- **8ct**: Base price + $1
- **12ct**: Base price + $2

| SKU | Name | Base Price (6ct) | 8ct Price | 12ct Price |
|-----|------|------------------|-----------|------------|
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
2. **Topping SKUs** - Match against the Toppings table above
3. **Prices** - Verify the price matches the SKU

Example order line:
```
1. Candy Strawberries - 8ct × 1
   SKU: CS08
   Price: $24.00
   Toppings: Nerds [NERD] (+$3), Starburst [STRB] (+$3)
```

To verify:
- CS08 = Candy Strawberries 8ct = $18.00
- NERD (8ct) = $3.00
- STRB (8ct) = $3.00
- Total: $18 + $3 + $3 = $24.00 ✓
