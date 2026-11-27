import { defineContent, projectsSchema } from "./schema";

// Source: docs/content.md §5. Featured order: Automiq, Lumina, AskDB, URLGen.
// Grid order: Map.io, Imagify, TaskFlow. Covers arrive in P5.
export const projects = defineContent(
  projectsSchema,
  [
    {
      slug: "automiq",
      title: "Automiq",
      tagline:
        "Draw a workflow, publish it, and run it durably on Temporal, with bounded AI agents and human approvals.",
      year: 2026,
      status: "in-progress",
      featured: true,
      order: 1,
      tags: ["GenAI", "Backend", "Full-stack"],
      stack: [
        "Python",
        "FastAPI",
        "Temporal",
        "LangGraph",
        "PostgreSQL",
        "Redis",
        "Next.js",
        "React Flow",
        "Docker Compose",
        "Playwright",
      ],
      role: "Solo: design, backend, frontend, ops",
      links: { repo: "https://github.com/vinaymoger1836/Automiq" },
      problem:
        "Automation tools either run steps fragilely, so a crash loses the run, or let AI agents act without limits. Teams need workflows that survive restarts, stay auditable, and keep a human in the loop for risky steps.",
      approach: [
        "Workflows are drawn in a visual graph editor (React Flow), published as immutable versions, and run on Temporal with inspectable step histories.",
        "Bounded LangGraph agent nodes: tool allowlists, iteration and budget limits, and structured outputs.",
        "Durable human-approval steps that survive worker restarts.",
        "Hardened with run admission limits, retention jobs, and fault-injection checks that restart the API and worker mid-run.",
      ],
      features: [
        "Multi-tenant workspaces",
        "Manual, signed-webhook and scheduled triggers",
        "GitHub and Slack integrations with encrypted credentials",
        "Approval inbox",
        "Custom app connections via signed CloudEvents 1.0",
        "Zoho Projects connector (US/EU/India data centres)",
        "Restricted HTTPS GET connector with DNS/TLS/redirect safeguards",
      ],
      outcomes: [
        {
          label: "Phase gates",
          value:
            "All phase gates (workflows, durable runs, fault injection, integrations, agents + approvals, operations) pass locally against fake providers.",
        },
      ],
    },
    {
      slug: "lumina",
      title: "Lumina",
      tagline:
        "RAG over your PDFs and URLs, with hybrid retrieval, reranking, an agent mode, and an eval harness to prove it works.",
      year: 2026,
      status: "live",
      featured: true,
      order: 2,
      tags: ["GenAI", "Backend", "Cloud"],
      stack: [
        "Python",
        "FastAPI",
        "LangChain",
        "LangGraph",
        "Qdrant",
        "Groq (Llama 3.3 70B)",
        "sentence-transformers",
        "Tavily",
        "n8n",
        "Streamlit",
        "Docker",
        "AWS EC2",
      ],
      role: "Solo",
      links: {
        live: "https://huggingface.co/spaces/vinnu18/lumina",
        repo: "https://github.com/vinaymoger1836/Lumina",
      },
      problem:
        "Plain vector search misses exact strings like error codes, version numbers and rare names, and most RAG demos never measure whether answers are actually grounded.",
      approach: [
        "Hybrid retrieval: dense and sparse vectors fused with Reciprocal Rank Fusion in Qdrant, then a cross-encoder reranker.",
        "Conversational query rewriting, so follow-ups resolve correctly, plus document-scoped search.",
        "LangGraph agent mode that routes between document search, web search and summarization.",
        "n8n automations: auto-ingest PDFs dropped into a Google Drive folder, and a daily Gmail digest.",
      ],
      architectureNote:
        "UI on Hugging Face Spaces → FastAPI on AWS EC2 → Qdrant Cloud + Groq + Tavily; n8n runs on the same EC2 via Docker Compose.",
      features: [
        "PDF/URL ingest with citations",
        "Knowledge-base management",
        "Agent mode",
        "Evaluation harness (retrieval: hit rate, precision, MRR; generation: faithfulness, relevance, correctness via LLM-as-judge)",
      ],
      outcomes: [
        { label: "Precision", value: "0.90 → 0.98" },
        { label: "Top-1 correctness", value: "0.82 → 0.91" },
        { label: "MRR", value: "0.96 → 1.00" },
        {
          label: "Exact-string probes",
          value: "Dense-only missed; hybrid ranked them #1",
        },
      ],
      note: "Measured on a 12-question golden set, hybrid + rerank vs dense-only. On its own, fusion didn't improve top-1 and needed the reranker to pay off; with 12 cases, one flipped answer moves correctness by ~0.09.",
    },
    {
      slug: "askdb",
      title: "AskDB",
      tagline:
        "Ask in plain English and get safe, validated SQL, a results table, an auto-chart and a one-line answer.",
      year: 2026,
      status: "live",
      featured: true,
      order: 3,
      tags: ["GenAI", "Backend"],
      stack: [
        "Python",
        "FastAPI",
        "sqlglot",
        "SQLite",
        "Groq (Llama 3.3 70B)",
        "Streamlit",
        "Plotly",
        "pandas",
        "pytest",
        "ruff",
        "Docker",
      ],
      role: "Solo",
      links: {
        live: "https://huggingface.co/spaces/vinnu18/AskDB",
        repo: "https://github.com/vinaymoger1836/AskDB",
      },
      problem:
        "Letting an LLM write SQL against real data is risky, because one bad query can write, drop or scan everything.",
      approach: [
        "Generated SQL is treated as untrusted input: sqlglot AST validation (SELECT-only, single statement, enforced LIMIT), a read-only connection and a statement timeout.",
        "Self-correcting retries: a SQL error is fed back to the model.",
        "Multi-turn follow-ups such as “now break that down by month”.",
      ],
      features: [
        "Bring your own CSV/Excel",
        "“Explain this query”",
        "Auto-chart picker",
        "CSV/Excel export",
        "LRU result cache that skips both LLM calls on repeats",
      ],
      outcomes: [
        {
          label: "Tests",
          value: "The pytest suite runs with a mocked LLM (no API key needed).",
        },
        {
          label: "Deploy",
          value: "Deployed as a Docker Space on Hugging Face.",
        },
      ],
    },
    {
      slug: "urlgen",
      title: "URLGen",
      tagline:
        "Redirects served from Cloudflare's edge, with click analytics kept off the critical path.",
      year: 2026,
      status: "in-progress",
      featured: true,
      order: 4,
      tags: ["Backend", "Cloud", "Full-stack"],
      stack: [
        "Cloudflare Workers + KV",
        "Node",
        "Fastify",
        "TypeScript",
        "DynamoDB",
        "Redis",
        "ClickHouse",
        "Next.js",
        "Zod",
        "Vitest",
        "pnpm workspaces",
      ],
      role: "Solo",
      links: {
        live: "coming-soon",
        repo: "https://github.com/vinaymoger1836/URLgen",
      },
      problem:
        "A shortener has to redirect fast everywhere in the world and record every click, without the tracking slowing the redirect or blowing past free-tier limits.",
      approach: [
        "Redirects resolve from Workers KV at the edge, with DynamoDB as the single source of truth and each tier a cache of the one below it.",
        "Clicks are fire-and-forget into a Redis buffer, then batch-inserted into ClickHouse, which degrades badly on single-row inserts.",
        "Random base62 slugs with DynamoDB conditional writes, giving lock-free allocation with no enumerable IDs.",
        "Rejection sampling keeps the slug keyspace uniform, avoiding the byte % 62 bias.",
      ],
      features: [
        "Per-owner dedup (no cross-user leaks)",
        "Canonicalisation used for dedup only, never for the redirect",
        "Privacy-first analytics (salted, daily-rotating IP hash, coarse geography)",
        "Documented threat model",
      ],
      outcomes: [
        {
          label: "Cost",
          value: "The whole system is designed to run within free-tier limits.",
        },
      ],
    },
    {
      slug: "map-io",
      title: "Map.io",
      tagline:
        "An interactive map of Europe, Russia and the Arctic, with a war-games sandbox and a real-time combat simulation engine.",
      year: 2026,
      status: "live",
      featured: false,
      order: 1,
      tags: ["Frontend", "Full-stack"],
      stack: [
        "Next.js",
        "React",
        "TypeScript",
        "MapLibre GL",
        "Three.js",
        "GeoJSON",
        "Vitest",
        "Playwright",
        "Vercel",
      ],
      role: "Solo",
      links: {
        live: "https://mapio-xi.vercel.app/",
        repo: "https://github.com/vinaymoger1836/Map.io",
      },
      approach: [
        "Zoom-tiered rendering: rank-based detail so hidden labels don't block visible ones.",
        "Data-driven GeoJSON layers for borders, energy and military.",
        "Three modes: Situation Map, War Games sandbox (paint countries, deploy and drag units) and WarSim.",
      ],
      features: [
        "WarSim engine with kinematic movement, physics-based radar detection (radar cross-section, radar range equation), fog-of-war, multi-layer air defence and After-Action Reports",
        "No API keys needed",
      ],
      outcomes: [],
      note: "The conflict data is a hand-drawn approximation for orientation only. This is a mapping and simulation engineering project.",
    },
    {
      slug: "imagify",
      title: "Imagify",
      tagline:
        "Upload images, get AI labels via Rekognition, follow people, and browse personalised feeds served as CDN-cached WebP.",
      year: 2026,
      status: "in-progress",
      featured: false,
      order: 2,
      tags: ["Cloud", "Full-stack"],
      stack: [
        "React",
        "Vite",
        "Node.js",
        "Express",
        "AWS (S3, CloudFront, API Gateway, Cognito, EC2, SQS + DLQ, Lambda, DynamoDB, Rekognition, CodePipeline/CodeBuild)",
        "Sharp",
      ],
      role: "Solo. An end-to-end AWS project covering compute, storage, serverless, queues, CDN, auth and CI/CD.",
      links: {
        live: "coming-soon",
        repo: "https://github.com/vinaymoger1836/Imagify",
      },
      approach: [
        "Presigned-URL uploads to S3 trigger SQS, then Lambda runs Rekognition labels plus Sharp WebP derivatives (thumb/medium) served from CloudFront.",
        "A DLQ catches failures after 3 attempts, and hash-based duplicate detection blocks repeat uploads.",
      ],
      features: [
        "Cognito auth",
        "Follow graph",
        "Like/dislike",
        "Personalised feeds",
        "Per-post engagement analytics",
        "Label filters",
        "Push-to-deploy CI/CD",
      ],
      outcomes: [],
    },
    {
      slug: "taskflow",
      title: "TaskFlow",
      tagline:
        "Manage your tasks by chatting: add, reschedule, filter and bulk-clear through an AI sidebar.",
      year: 2026,
      status: "in-progress",
      featured: false,
      order: 3,
      tags: ["GenAI", "Frontend"],
      stack: [
        "Next.js",
        "React 19",
        "TypeScript",
        "Tailwind CSS",
        "CopilotKit",
        "Groq / Gemini / OpenRouter",
      ],
      role: "Solo",
      links: {
        live: "coming-soon",
        repo: "https://github.com/vinaymoger1836/TaskFlow",
      },
      approach: [],
      features: [
        "Conversational task control via CopilotKit actions",
        "Past-date guardrails in both the AI and the forms",
        "Overdue highlighting",
        "Smart presets",
        "Filter, search and sort",
        "localStorage persistence",
      ],
      outcomes: [],
    },
  ],
  "projects.ts",
);

export const featuredProjects = projects
  .filter((p) => p.featured)
  .sort((a, b) => a.order - b.order);

export const gridProjects = projects
  .filter((p) => !p.featured)
  .sort((a, b) => a.order - b.order);
