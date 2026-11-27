import { defineContent, sectionsSchema } from "./schema";

// Home-page sections in display order (handoff §3). Headings are drafts for
// Vinay to review; `emphasis` is the part set in Instrument Serif italic.
// Section numbers ("01 / About") are computed from the sections actually shown.
export const sections = defineContent(
  sectionsSchema,
  [
    {
      id: "about",
      navLabel: "About",
      label: "About",
      heading: { text: "Production systems, end to end", emphasis: "end to end" },
    },
    {
      id: "skills",
      navLabel: "Skills",
      label: "Skills",
      heading: { text: "Tools I reach for", emphasis: "reach for" },
    },
    {
      id: "projects",
      navLabel: "Projects",
      label: "Projects",
      heading: { text: "Things I've built", emphasis: "built" },
    },
    {
      id: "experience",
      navLabel: "Experience",
      label: "Experience",
      heading: { text: "Where I've worked", emphasis: "worked" },
    },
    {
      id: "services",
      navLabel: "Services",
      label: "Services",
      heading: { text: "What I can help with", emphasis: "help with" },
      intro:
        "Open to freelance projects. Here's where I can help, based on systems I've built in production and in my own projects.",
    },
    {
      id: "interests",
      label: "Interests",
      heading: { text: "Beyond work", emphasis: "work" },
    },
    {
      id: "testimonials",
      label: "Testimonials",
      heading: { text: "Kind words", emphasis: "words" },
    },
    {
      id: "contact",
      navLabel: "Contact",
      label: "Contact",
      heading: { text: "Let's build something", emphasis: "something" },
    },
  ],
  "sections.ts",
);
