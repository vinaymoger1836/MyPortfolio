// Site-wide settings. The zod schema and the remaining fields (url, contact, …) land in Phase 1.
export type Accent = "lime" | "violet";

export const site = {
  title: "Vinayakumar Moger · Software Developer",
  description:
    "Software Developer in Bengaluru. I build Python backends and GenAI systems (RAG, agents and integrations) that hold up in production.",
  accent: "lime" as Accent,
  ui: {
    themeToggle: "Toggle light and dark theme",
  },
  // Phase 0 placeholder page only; removed when the real sections land.
  placeholder: {
    label: "00 / Status",
    lead: "Portfolio coming",
    emphasis: "soon",
  },
} as const;
