import { z } from "zod";
import { projects } from "./projects";
import { defineContent, sectionIds, serviceSchema } from "./schema";

// Source: docs/content.md §7. No paid freelance work yet: this is "what I can help with",
// never past clients. No prices. Proof links point at home-page anchors until the
// case-study pages land in P3.
const validAnchors = new Set<string>([
  ...sectionIds.map((id) => `#${id}`),
  ...projects.map((p) => `#project-${p.slug}`),
]);

const servicesSchema = z.array(serviceSchema).superRefine((services, ctx) => {
  services.forEach((s, i) =>
    s.proof.forEach((p, j) => {
      if (p.href.startsWith("#") && !validAnchors.has(p.href)) {
        ctx.addIssue({
          code: "custom",
          message: `proof link "${p.href}" doesn't match any section or project on the page`,
          path: [i, "proof", j, "href"],
        });
      }
    }),
  );
});

export const services = defineContent(
  servicesSchema,
  [
    {
      title: "GenAI features & RAG",
      summary:
        "Add AI to your product, such as document Q&A, assistants or text-to-SQL, with measured quality and guardrails.",
      includes: [
        "RAG with hybrid retrieval and reranking",
        "Evaluation set and metrics",
        "LLM agents with tool limits",
        "MCP servers that connect LLMs to your systems",
        "Deploy on free or low-cost infrastructure",
      ],
      proof: [
        { label: "Lumina", href: "#project-lumina" },
        { label: "AskDB", href: "#project-askdb" },
        { label: "The MCP server and agent at Zimplistic", href: "#experience" },
      ],
      engagement: ["fixed", "hourly"],
    },
    {
      title: "Backend APIs & integrations",
      summary:
        "Python/FastAPI services and integrations between the tools your business already runs.",
      includes: [
        "REST API design and build",
        "Shopify, Odoo and SaaS integrations",
        "Webhooks and scheduled jobs",
        "PostgreSQL schema",
        "Docker deploy",
      ],
      proof: [
        {
          label: "~30 production REST APIs with Shopify integration",
          href: "#experience",
        },
        { label: "URLGen", href: "#project-urlgen" },
      ],
      engagement: ["fixed", "hourly"],
    },
    {
      title: "Workflow automation & internal tools",
      summary:
        "Replace spreadsheet-and-copy-paste processes with tools your team can run on its own.",
      includes: [
        "Process mapping",
        "Automation (Temporal, n8n, cron)",
        "Operator dashboards",
        "Approval steps",
        "Handover docs",
      ],
      proof: [
        { label: "Order-allocation engine (3–6 h → < 30 min)", href: "#experience" },
        { label: "QAConsole", href: "#experience" },
        { label: "Automiq", href: "#project-automiq" },
      ],
      engagement: ["fixed", "hourly"],
    },
    {
      title: "Odoo ERP/MES development",
      summary:
        "Custom Odoo v17 modules, automation and fixes for manufacturing and after-sales operations.",
      includes: [
        "Custom modules",
        "Cron automation",
        "RMA and warranty flows",
        "Performance fixes",
        "API endpoints",
      ],
      proof: [
        { label: "Order-allocation engine", href: "#experience" },
        { label: "RMA module", href: "#experience" },
        { label: "Warranty automation", href: "#experience" },
      ],
      engagement: ["fixed", "hourly"],
    },
  ],
  "services.ts",
);
