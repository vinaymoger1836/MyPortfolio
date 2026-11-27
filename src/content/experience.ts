import { defineContent, experienceFileSchema } from "./schema";

// Source: docs/content.md §6. Education has no dates or grade (by request).
// Certificate links were matched to their names by opening each verify page (2026-11-27).
export const experience = defineContent(
  experienceFileSchema,
  {
    entries: [
      {
        kind: "work",
        org: "Zimplistic India Pvt Ltd",
        title: "Software Developer",
        start: "Jan 2025",
        end: "Sep 2026",
        location: "Bengaluru",
        mobileBullets: 4,
        bullets: [
          "Built a Model Context Protocol (MCP) server and a LangGraph-based agentic system connecting LLMs to customer-support workflows; released internally for testing and feedback.",
          "Solely built an automated order-allocation engine in Odoo v17 that assigns inventory from sales, RMA and support data by priority, order type and location, cutting a 3–6 hour cross-team spreadsheet process to under 30 minutes of approval.",
          "Built and solely owned QAConsole, a multi-threaded Python/PyQt6 app that merged three production tools into one operator interface, cutting ~18 manual commands per unit to one click over pyserial, WebSocket and MQTT; supported a production ramp from ~20 to 60–70 units/day.",
          "Delivered ~30 REST APIs across Odoo modules, integrating Shopify and an internal customer-support tool (order details, shipment tracking, RMA creation, customer lookup).",
          "Streamed test logs to an event-driven AWS backend (S3, Lambda, MySQL, API Gateway) feeding a stakeholder dashboard for per-machine failure analysis.",
          "Stabilised the production RMA module (bug and performance fixes) and automated refund, replacement and warranty status/extension handling with Odoo cron jobs.",
          "Built an over-the-air firmware update pipeline with GitHub Actions and AWS IoT Core.",
        ],
        stack: [
          "Python",
          "Odoo v17",
          "PostgreSQL",
          "MySQL",
          "AWS (Lambda, S3, API Gateway, IoT Core)",
          "LangGraph",
          "MCP",
          "PyQt6",
          "MQTT",
          "GitHub Actions",
        ],
      },
      {
        kind: "education",
        org: "R V College of Engineering",
        title: "B.E. in Computer Science",
        location: "Bengaluru",
        bullets: [],
      },
    ],
    certifications: [
      {
        name: "Introduction to Model Context Protocol",
        issuer: "Anthropic",
        year: 2026,
        url: "https://verify.skilljar.com/c/m2jtvt3sxes5",
      },
      {
        name: "Building with the Claude API",
        issuer: "Anthropic",
        year: 2026,
        url: "https://verify.skilljar.com/c/ad4qrrhth87q",
      },
    ],
  },
  "experience.ts",
);
