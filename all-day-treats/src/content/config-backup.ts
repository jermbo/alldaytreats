import { defineCollection, z } from 'astro:content';

const products = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    id: z.string(),
    name: z.string(),
    category: z.enum(['candy', 'chocolate', 'platter']),
    image: image(),
    priceFrom: z.number().positive(),
    priceOptions: z.array(z.object({
      count: z.number().positive(),
      price: z.number().positive(),
    })),
    extraAddOns: z.number().default(5),
    order: z.number().default(999),
  }),
});

export const collections = { products };
