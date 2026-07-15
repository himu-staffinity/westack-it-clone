import { defineCollection, z } from 'astro:content';

const products = defineCollection({
  // Add `image` to the destructuring
  schema: ({ image }) => z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    // Change the type of the icon to `image()`
    iconPNG: image(),
    icon: image(),
    tags: z.array(z.string()).optional(),
    price: z.number(),
    priceComment: z.string().default(''),
    lang: z.enum(['de', 'en']).default('de'),
    faq: z.array(
      z.object({
        name: z.string(),
        acceptedAnswer: z.string(),
      })
    ),
  }),
});

const pages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    lang: z.string().default("en"),
  }),
});

export const collections = { products, pages };