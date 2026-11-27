import { z } from "zod";
import { defineContent, testimonialSchema } from "./schema";

// Source: docs/content.md §9. None yet, so the section stays hidden.
// Only add real quotes from real people, with their permission.
export const testimonials = defineContent(
  z.array(testimonialSchema),
  [],
  "testimonials.ts",
);
