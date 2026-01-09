import { Product, Topping } from '@/types/product';

import candyGrapes from '@/assets/candy-grapes.jpg';
import candyPineapple from '@/assets/candy-pineapple-rings.jpg';
import candyStrawberries from '@/assets/candy-strawberries.jpg';
import chocolateStrawberries from '@/assets/chocolate-strawberries.jpg';
import cakePops from '@/assets/cake-pops.jpg';
import chocolateOreos from '@/assets/chocolate-oreos.jpg';
import chocolatePretzels from '@/assets/chocolate-pretzels.jpg';
import chocolateRiceKrispies from '@/assets/chocolate-rice-krispies.jpg';
import platter from '@/assets/platter.jpg';

export const products: Product[] = [
  {
    id: 'candy-grapes',
    name: 'Candy Grapes',
    description: 'Fresh grapes coated in a sweet candy shell with colorful sprinkles',
    image: candyGrapes,
    priceOptions: [
      { count: 6, price: 10 },
      { count: 8, price: 15 },
      { count: 12, price: 20 },
    ],
    extraAddOns: 5,
    category: 'candy',
  },
  {
    id: 'candy-pineapple',
    name: 'Candy Pineapple Rings/Chunks',
    description: 'Sweet pineapple rings and chunks with candy coating',
    image: candyPineapple,
    priceOptions: [
      { count: 6, price: 12 },
      { count: 8, price: 17 },
      { count: 12, price: 27 },
    ],
    extraAddOns: 5,
    category: 'candy',
  },
  {
    id: 'candy-strawberries',
    name: 'Candy Strawberries',
    description: 'Juicy strawberries with a vibrant candy coating',
    image: candyStrawberries,
    priceOptions: [
      { count: 6, price: 10 },
      { count: 8, price: 15 },
      { count: 12, price: 20 },
    ],
    extraAddOns: 5,
    category: 'candy',
  },
  {
    id: 'chocolate-strawberries',
    name: 'Chocolate Covered Strawberries',
    description: 'Premium strawberries dipped in rich chocolate with drizzle',
    image: chocolateStrawberries,
    priceOptions: [
      { count: 6, price: 10 },
      { count: 8, price: 15 },
      { count: 12, price: 20 },
    ],
    extraAddOns: 5,
    category: 'chocolate',
  },
  {
    id: 'cake-pops',
    name: 'Cake Pops / Cakesicles',
    description: 'Delicious cake pops with colorful candy coating',
    image: cakePops,
    priceOptions: [
      { count: 6, price: 10 },
      { count: 8, price: 17 },
      { count: 12, price: 27 },
    ],
    extraAddOns: 5,
    category: 'chocolate',
  },
  {
    id: 'chocolate-oreos',
    name: 'Chocolate Covered Oreos',
    description: 'Classic Oreos dipped in chocolate with decorative drizzle',
    image: chocolateOreos,
    priceOptions: [
      { count: 6, price: 10 },
      { count: 8, price: 15 },
      { count: 12, price: 20 },
    ],
    extraAddOns: 5,
    category: 'chocolate',
  },
  {
    id: 'chocolate-pretzels',
    name: 'Chocolate Covered Pretzels',
    description: 'Crunchy pretzels with chocolate coating and sprinkles',
    image: chocolatePretzels,
    priceOptions: [
      { count: 6, price: 10 },
      { count: 8, price: 15 },
      { count: 12, price: 20 },
    ],
    extraAddOns: 5,
    category: 'chocolate',
  },
  {
    id: 'chocolate-rice-krispies',
    name: 'Chocolate Covered Rice Krispies',
    description: 'Crispy Rice Krispie treats with chocolate coating',
    image: chocolateRiceKrispies,
    priceOptions: [
      { count: 6, price: 15 },
      { count: 8, price: 15 },
      { count: 12, price: 20 },
    ],
    extraAddOns: 5,
    category: 'chocolate',
  },
  {
    id: 'party-platter',
    name: 'Party Platter',
    description: 'Assorted treats perfect for any occasion',
    image: platter,
    priceOptions: [
      { count: 1, price: 45 },
      { count: 2, price: 55 },
      { count: 3, price: 60 },
    ],
    extraAddOns: 5,
    category: 'platter',
  },
];

export const toppings: Topping[] = [
  { id: 'jolly-ranchers', name: 'Jolly Ranchers', price: 0 },
  { id: 'nerds', name: 'Nerds', price: 0 },
  { id: 'starburst', name: 'Starburst', price: 0 },
  { id: 'skittles', name: 'Skittles', price: 0 },
  { id: 'airheads', name: 'Airheads', price: 0 },
  { id: 'candy-sauce', name: 'Candy Sauce', price: 1 },
  { id: 'fruit-roll-up', name: 'Fruit Roll Up', price: 5 },
];

export const platterSizes = [
  { name: 'Small', price: 45 },
  { name: 'Medium', price: 55 },
  { name: 'Large', price: 60 },
  { name: 'Theme (+$10)', price: 10 },
];
