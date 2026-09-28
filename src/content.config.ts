import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Blog: članci u src/content/blog/*.md. Naziv datoteke je adresa članka (/blog/<naziv>).
const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/blog' }),
  schema: z.object({
    /** naslov u tražilici (50–60 znakova, ključna riječ naprijed, „| Levanat” na kraju) */
    title: z.string(),
    /** naslov na stranici (H1) */
    naslov: z.string(),
    /** meta opis (do 155 znakova, s pozivom na kraju) */
    description: z.string().max(160),
    /** kratki uvod u popisu članaka */
    sazetak: z.string(),
    objavljeno: z.coerce.date(),
    azurirano: z.coerce.date().optional(),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  }),
});

export const collections = { blog };
