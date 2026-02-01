import { defineCollection, z } from 'astro:content';

const products = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    category: z.enum(['candy', 'chocolate', 'platter']),
    image: z.string(),
    priceFrom: z.number().positive(),
    priceOptions: z.array(z.object({
      count: z.number().positive(),
      price: z.number().positive(),
      sku: z.string(), // Unique product variant identifier for order verification
    })),
    extraAddOns: z.number().default(5),
    order: z.number().default(999),
  }),
});

export const collections = { products };
