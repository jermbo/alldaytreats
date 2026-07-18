import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const products = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/products" }),
	schema: z.object({
		name: z.string(),
		category: z.enum(["candy", "chocolate", "platter"]),
		image: z.string(),
		priceFrom: z.number().positive(),
		priceOptions: z.array(
			z.object({
				count: z.number().positive(),
				price: z.number().positive(),
				sku: z.string(),
			}),
		),
		extraAddOns: z.number().default(5),
		order: z.number().default(999),
		packageKind: z.enum(["chocolate", "candy-fruit"]).optional(),
		includes: z.string().optional(),
		requiresFlavor: z.boolean().optional().default(false),
	}),
});

export const collections = { products };
