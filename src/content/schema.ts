import { z } from "zod";

/**
 * Content schemas (handoff §6). Every content file passes its data through
 * `defineContent`, so a typo fails `pnpm build` with a readable message
 * instead of breaking the page.
 */

export function defineContent<S extends z.ZodType>(
  schema: S,
  data: z.input<S>,
  file: string,
): z.output<S> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `\n\nInvalid content in src/content/${file}:\n${z.prettifyError(result.error)}\n`,
    );
  }
  return result.data;
}

/* ---------- shared ---------- */

const text = z.string().trim().min(1);
const httpsUrl = z.url({ protocol: /^https$/ });

/** Every image needs alt text. */
export const imageSchema = z.object({
  src: text,
  alt: text,
  caption: text.optional(),
});

/** Keys of the lucide icon map in src/components/ui/icons.ts. */
export const iconKeys = [
  "sparkles",
  "server",
  "database",
  "cloud",
  "flask",
  "layout",
  "plug",
  "factory",
  "users",
  "gamepad",
  "book",
  "brain",
] as const;
export const iconSchema = z.enum(iconKeys);
export type IconKey = z.infer<typeof iconSchema>;

/* ---------- profile ---------- */

export const socialSchema = z.object({
  platform: z.enum([
    "github",
    "linkedin",
    "huggingface",
    "x",
    "leetcode",
    "medium",
    "other",
  ]),
  url: httpsUrl,
  label: text,
});
export type Social = z.infer<typeof socialSchema>;

export const factSchema = z.object({
  /** Shown before the number, e.g. "~". Kept apart so `value` can count up in P2. */
  prefix: z.string().optional(),
  value: z.number().nonnegative(),
  /** Shown after the number, e.g. " yrs" or "×". */
  suffix: z.string().optional(),
  label: text,
});

export const profileSchema = z.object({
  name: text,
  shortName: text,
  role: text,
  roles: z.array(text).min(1),
  pitch: text,
  bio: z.array(text).min(1),
  lookingFor: text.optional(),
  location: text,
  timezone: text,
  availability: z.object({
    fullTime: z.boolean(),
    freelance: z.boolean(),
    remote: z.boolean(),
    /** Text in the hero pill. */
    label: text,
    note: text.optional(),
  }),
  email: z.email(),
  photo: imageSchema.optional(),
  resumeUrl: text.startsWith("/"),
  socials: z.array(socialSchema),
  facts: z.array(factSchema),
});
export type Profile = z.infer<typeof profileSchema>;

/* ---------- skills ---------- */

export const skillSchema = z.object({
  name: text,
  level: z.enum(["core", "familiar"]),
});

export const skillGroupSchema = z.object({
  title: text,
  icon: iconSchema,
  skills: z.array(skillSchema).min(1),
});

/** Brand logos available in src/components/ui/BrandIcon.tsx (simple-icons + LinkedIn glyph). */
export const brandKeys = [
  "python",
  "fastapi",
  "langchain",
  "langgraph",
  "qdrant",
  "postgresql",
  "docker",
  "react",
  "nextdotjs",
  "typescript",
  "odoo",
  "githubactions",
  "redis",
  "github",
  "huggingface",
  "linkedin",
] as const;
export const brandSchema = z.enum(brandKeys);
export type BrandKey = z.infer<typeof brandSchema>;

export const marqueeItemSchema = z.object({
  name: text,
  /** Brand logo key; without one the item renders as text only. */
  logo: brandSchema.optional(),
});

export const skillsSchema = z.object({
  groups: z.array(skillGroupSchema),
  marquee: z.array(marqueeItemSchema),
});
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type MarqueeItem = z.infer<typeof marqueeItemSchema>;

/* ---------- projects ---------- */

export const projectTags = [
  "GenAI",
  "Backend",
  "Full-stack",
  "Cloud",
  "Frontend",
] as const;
export const projectTagSchema = z.enum(projectTags);
export type ProjectTag = z.infer<typeof projectTagSchema>;

export const projectStatusSchema = z.enum([
  "live",
  "in-progress",
  "design-case-study",
]);
export type ProjectStatus = z.infer<typeof projectStatusSchema>;

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "use kebab-case"),
  title: text,
  tagline: text,
  year: z.number().int().min(2000).max(2100),
  status: projectStatusSchema,
  featured: z.boolean(),
  order: z.number().int().nonnegative(),
  tags: z.array(projectTagSchema).min(1),
  stack: z.array(text).min(1),
  role: text,
  team: text.optional(),
  duration: text.optional(),
  /** Optional until P5; cards fall back to a typographic CSS cover. */
  cover: imageSchema.optional(),
  gallery: z.array(imageSchema).optional(),
  links: z.object({
    /** 'coming-soon' renders a muted chip, never a dead link. */
    live: z.union([httpsUrl, z.literal("coming-soon")]).optional(),
    repo: httpsUrl.optional(),
    demoVideo: httpsUrl.optional(),
  }),
  problem: text.optional(),
  approach: z.array(text),
  architecture: imageSchema.optional(),
  /** Plain-text architecture description until the diagram exists. */
  architectureNote: text.optional(),
  features: z.array(text),
  outcomes: z.array(z.object({ label: text, value: text })),
  /** Honest caveat shown on the case study. */
  note: text.optional(),
});
export type Project = z.infer<typeof projectSchema>;

export const projectsSchema = z
  .array(projectSchema)
  .superRefine((projects, ctx) => {
    const seen = new Set<string>();
    const featuredOrders = new Set<number>();
    projects.forEach((p, i) => {
      if (seen.has(p.slug)) {
        ctx.addIssue({
          code: "custom",
          message: `duplicate slug "${p.slug}"`,
          path: [i, "slug"],
        });
      }
      seen.add(p.slug);
      const key = p.featured ? p.order : p.order + 10_000;
      if (featuredOrders.has(key)) {
        ctx.addIssue({
          code: "custom",
          message: `duplicate order ${p.order} in ${p.featured ? "featured" : "grid"} projects`,
          path: [i, "order"],
        });
      }
      featuredOrders.add(key);
    });
  });

/* ---------- experience ---------- */

export const experienceSchema = z
  .object({
    kind: z.enum(["work", "education"]),
    org: text,
    title: text,
    start: text.optional(),
    end: z.union([text, z.literal("present")]).optional(),
    location: text.optional(),
    bullets: z.array(text),
    /** How many bullets to show on mobile before "Show more". */
    mobileBullets: z.number().int().positive().optional(),
    stack: z.array(text).optional(),
    logo: imageSchema.optional(),
  })
  .refine((e) => e.kind !== "education" || (!e.start && !e.end), {
    message: "education entries have no dates",
  });
export type Experience = z.infer<typeof experienceSchema>;

export const certificationSchema = z.object({
  name: text,
  issuer: text,
  year: z.number().int().min(2000).max(2100),
  url: httpsUrl.optional(),
});
export type Certification = z.infer<typeof certificationSchema>;

export const experienceFileSchema = z.object({
  entries: z.array(experienceSchema),
  certifications: z.array(certificationSchema),
});

/* ---------- services ---------- */

export const serviceSchema = z.object({
  title: text,
  summary: text,
  includes: z.array(text).min(1),
  /**
   * Home anchor ("#experience"), case study ("/projects/lumina") or an https
   * URL; never a dead link (services.ts checks anchors and slugs exist).
   */
  proof: z.array(
    z.object({
      label: text,
      href: z.union([
        z.string().regex(/^#[a-z0-9-]+$/),
        z.string().regex(/^\/projects\/[a-z0-9-]+$/),
        httpsUrl,
      ]),
    }),
  ),
  engagement: z.array(z.enum(["fixed", "hourly", "retainer"])).min(1),
});
export type Service = z.infer<typeof serviceSchema>;

/* ---------- interests & testimonials ---------- */

export const interestSchema = z.object({
  title: text,
  icon: iconSchema,
  line: text.optional(),
});
export type Interest = z.infer<typeof interestSchema>;

export const testimonialSchema = z.object({
  quote: text,
  name: text,
  role: text,
  company: text,
  avatar: imageSchema.optional(),
  url: httpsUrl.optional(),
});
export type Testimonial = z.infer<typeof testimonialSchema>;

/* ---------- sections ---------- */

export const sectionIds = [
  "about",
  "skills",
  "projects",
  "experience",
  "services",
  "interests",
  "testimonials",
  "contact",
] as const;
export const sectionIdSchema = z.enum(sectionIds);
export type SectionId = z.infer<typeof sectionIdSchema>;

export const sectionSchema = z
  .object({
    id: sectionIdSchema,
    /** Link text in the nav; omit to keep the section out of the nav. */
    navLabel: text.optional(),
    /** Mono label, rendered as "01 / About". */
    label: text,
    heading: z.object({
      text: text,
      /** A word or phrase inside `text` set in Instrument Serif italic. */
      emphasis: text.optional(),
    }),
    intro: text.optional(),
  })
  .refine(
    (s) => !s.heading.emphasis || s.heading.text.includes(s.heading.emphasis),
    { message: "heading.emphasis must appear inside heading.text" },
  );
export type Section = z.infer<typeof sectionSchema>;

export const sectionsSchema = z
  .array(sectionSchema)
  .refine((s) => new Set(s.map((x) => x.id)).size === s.length, {
    message: "each section id may appear only once",
  });

/* ---------- site ---------- */

export const accentSchema = z.enum(["lime", "violet"]);
export type Accent = z.infer<typeof accentSchema>;

export const siteSchema = z.object({
  url: httpsUrl,
  title: text,
  description: text,
  ogImage: text.optional(),
  accent: accentSchema,
  contact: z.object({
    provider: z.enum(["web3forms", "formspree", "mailto"]),
    key: text.optional(),
  }),
  calUrl: httpsUrl.optional(),
  /** All interface microcopy, so components hold no strings. */
  ui: z.object({
    skipToContent: text,
    themeToggle: text,
    primaryNav: text,
    menuOpen: text,
    menuClose: text,
    hireMe: text,
    hero: z.object({
      viewWork: text,
      downloadCv: text,
      contact: text,
      socialsLabel: text,
      scrollCue: text,
    }),
    about: z.object({
      locationLabel: text,
      lookingForLabel: text,
      availabilityLabel: text,
      fullTime: text,
      freelance: text,
      remote: text,
      factsLabel: text,
      photoFallbackLabel: text,
    }),
    skills: z.object({
      core: text,
      familiar: text,
      legendLabel: text,
      marqueeLabel: text,
    }),
    projects: z.object({
      filterLabel: text,
      all: text,
      featuredLabel: text,
      moreLabel: text,
      /** "{count}" is replaced with the number of projects shown. */
      showing: text,
      empty: text,
      status: z.object({
        live: text,
        "in-progress": text,
        "design-case-study": text,
      }),
      liveDemo: text,
      comingSoon: text,
      code: text,
      stackLabel: text,
      opensInNewTab: text,
    }),
    /** Case-study pages (/projects/[slug]). */
    caseStudy: z.object({
      /** "{title}" and "{name}" are replaced in the page <title>. */
      metaTitle: text,
      backToProjects: text,
      /** Honest label for status 'design-case-study'. */
      designNote: text,
      noteLabel: text,
      meta: z.object({ role: text, timeline: text, team: text }),
      sections: z.object({
        problem: text,
        approach: text,
        architecture: text,
        features: text,
        outcomes: text,
        gallery: text,
        stack: text,
      }),
      moreProjects: text,
      previous: text,
      next: text,
      demoVideo: text,
      /** "{title}" is replaced with the project title. */
      ogAlt: text,
      lightbox: z.object({
        label: text,
        close: text,
        previous: text,
        next: text,
        /** "{n}" and "{total}" are replaced. */
        position: text,
        /** "{alt}" is replaced; accessible name of a gallery thumbnail. */
        open: text,
      }),
    }),
    notFound: z.object({
      metaTitle: text,
      label: text,
      title: text,
      body: text,
      home: text,
      projects: text,
    }),
    experience: z.object({
      showMore: text,
      stackLabel: text,
      educationLabel: text,
      certificationsLabel: text,
      verify: text,
      present: text,
    }),
    services: z.object({
      includesLabel: text,
      proofLabel: text,
      engagementLabel: text,
      engagement: z.object({ fixed: text, hourly: text, retainer: text }),
      cta: text,
    }),
    contact: z.object({
      emailLabel: text,
      copyEmail: text,
      copied: text,
      copyFailed: text,
      socialsLabel: text,
      formLabel: text,
      name: text,
      email: text,
      type: text,
      types: z.object({ job: text, freelance: text, other: text }),
      message: text,
      submit: text,
      required: text,
      errors: z.object({
        name: text,
        email: text,
        message: text,
      }),
      /** "{name}" and "{type}" are replaced in the mailto subject. */
      mailSubject: text,
      mailtoNote: text,
    }),
    footer: z.object({
      builtWith: text,
      lastUpdated: text,
      backToTop: text,
    }),
  }),
});
export type Site = z.infer<typeof siteSchema>;
