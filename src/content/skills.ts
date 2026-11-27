import { defineContent, skillsSchema } from "./schema";

// Source: docs/content.md §4. Resume skills are "core"; repo-only tools are "familiar".
const core = (...names: string[]) =>
  names.map((name) => ({ name, level: "core" as const }));
const familiar = (...names: string[]) =>
  names.map((name) => ({ name, level: "familiar" as const }));

export const skills = defineContent(
  skillsSchema,
  {
    groups: [
      {
        title: "GenAI / LLM",
        icon: "sparkles",
        skills: [
          ...core(
            "RAG (hybrid retrieval, cross-encoder reranking, query rewriting)",
            "Embeddings & vector search (Qdrant, pgvector)",
            "LangChain",
            "LangGraph",
            "Model Context Protocol (MCP)",
            "LLM evaluation (hit rate, precision, MRR, LLM-as-judge)",
            "Text-to-SQL guardrails",
            "LiteLLM",
            "Groq (Llama 3.3 70B)",
            "Gemini",
            "OpenAI",
          ),
          ...familiar("CopilotKit", "sentence-transformers", "Tavily"),
        ],
      },
      {
        title: "Backend",
        icon: "server",
        skills: [
          ...core(
            "Python",
            "FastAPI",
            "Pydantic",
            "REST API design",
            "SQL",
            "Odoo v17 (ORM, cron jobs)",
            "JavaScript",
          ),
          ...familiar(
            "Node.js / Express",
            "Fastify",
            "Temporal (durable workflows)",
          ),
        ],
      },
      {
        title: "Data",
        icon: "database",
        skills: [
          ...core("PostgreSQL", "MySQL", "SQLite", "pgvector", "Qdrant"),
          ...familiar("Redis", "DynamoDB", "ClickHouse"),
        ],
      },
      {
        title: "Cloud & DevOps",
        icon: "cloud",
        skills: [
          ...core(
            "AWS (Lambda, API Gateway, S3, IoT Core)",
            "Docker",
            "Docker Compose",
            "GitHub Actions",
            "Git",
            "Linux",
          ),
          ...familiar(
            "AWS (EC2, SQS, Cognito, CloudFront, Rekognition, CodePipeline)",
            "Cloudflare Workers / KV",
            "Vercel",
          ),
        ],
      },
      {
        title: "Testing & tools",
        icon: "flask",
        skills: [
          ...core("pytest", "ruff", "mypy", "Playwright"),
          ...familiar("Vitest", "PyQt6"),
        ],
      },
      {
        title: "Frontend",
        icon: "layout",
        skills: [
          ...core("React", "Streamlit", "Plotly", "Owl.js"),
          ...familiar(
            "Next.js",
            "TypeScript",
            "Tailwind CSS",
            "MapLibre GL",
            "React Flow",
          ),
        ],
      },
      {
        title: "Integrations",
        icon: "plug",
        skills: familiar(
          "Shopify",
          "MQTT",
          "WebSocket",
          "n8n",
          "GitHub & Slack APIs",
        ),
      },
    ],
    marquee: [
      { name: "Python", logo: "python" },
      { name: "FastAPI", logo: "fastapi" },
      { name: "LangChain", logo: "langchain" },
      { name: "LangGraph", logo: "langgraph" },
      { name: "Qdrant", logo: "qdrant" },
      { name: "PostgreSQL", logo: "postgresql" },
      { name: "Docker", logo: "docker" },
      { name: "AWS" },
      { name: "React", logo: "react" },
      { name: "Next.js", logo: "nextdotjs" },
      { name: "TypeScript", logo: "typescript" },
      { name: "Odoo", logo: "odoo" },
      { name: "GitHub Actions", logo: "githubactions" },
      { name: "Redis", logo: "redis" },
    ],
  },
  "skills.ts",
);
