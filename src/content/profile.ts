import { defineContent, profileSchema } from "./schema";

// Source: docs/content.md §1–§3.
export const profile = defineContent(
  profileSchema,
  {
    name: "Vinayakumar Moger",
    shortName: "VM",
    role: "Software Developer: Python, GenAI & Agentic Systems",
    roles: [
      "Backend engineer (Python)",
      "GenAI engineer",
      "Full-stack developer",
      "Agentic systems builder",
    ],
    pitch:
      "I build Python backends and GenAI systems (RAG, agents and integrations) that hold up in production.",
    bio: [
      "I'm a software developer in Bengaluru with about two years of experience building production systems for a hardware manufacturer: Odoo v17 ERP and MES modules on PostgreSQL, Python backends, event-driven AWS services, and the tools the production floor used every day.",
      "That work gave me hands-on knowledge of manufacturing operations, sales, RMA and warranty workflows, and after-sales support.",
      "Applied GenAI is where my interest is strongest, and I keep building in it outside work. I build RAG that's measured rather than eyeballed, LLM agents with hard limits, and text-to-SQL that treats generated queries as untrusted input.",
      "I like owning a problem from requirements to release, and building tools that non-technical teams can run on their own.",
    ],
    lookingFor:
      "Full Stack, Backend (Python) or GenAI Engineer roles where I build customer-facing products end to end, especially at product companies and AI-first startups. I'm also open to freelance GenAI, backend and integration work.",
    location: "Bengaluru, India",
    timezone: "IST (UTC+5:30)",
    availability: {
      fullTime: true,
      freelance: true,
      remote: true,
      label: "Open to full-time roles & freelance projects",
      note: "Bengaluru onsite/hybrid · can join within 30 days",
    },
    email: "vinaymoger1836@gmail.com",
    // photo: { src: "/images/profile/vinay.jpg", alt: "…" },  // add later; the VM monogram shows until then
    resumeUrl: "/resume.pdf",
    socials: [
      {
        platform: "github",
        url: "https://github.com/vinaymoger1836",
        label: "GitHub",
      },
      {
        platform: "linkedin",
        url: "https://linkedin.com/in/vinayakumar-moger",
        label: "LinkedIn",
      },
      {
        platform: "huggingface",
        url: "https://huggingface.co/vinnu18",
        label: "Hugging Face",
      },
    ],
    facts: [
      { prefix: "~", value: 2, suffix: " yrs", label: "building production systems" },
      { prefix: "~", value: 30, label: "REST APIs delivered" },
      {
        value: 3,
        suffix: "×",
        label: "production ramp supported (~20 → 60–70 units/day)",
      },
      { value: 2, label: "Anthropic certifications (Claude API, MCP)" },
    ],
  },
  "profile.ts",
);
