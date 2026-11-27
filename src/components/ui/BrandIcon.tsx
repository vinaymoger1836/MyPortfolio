import {
  siDocker,
  siFastapi,
  siGithub,
  siGithubactions,
  siHuggingface,
  siLangchain,
  siLanggraph,
  siNextdotjs,
  siOdoo,
  siPostgresql,
  siPython,
  siQdrant,
  siReact,
  siRedis,
  siTypescript,
} from "simple-icons";
import type { BrandKey } from "@/content/schema";

/**
 * simple-icons no longer ships LinkedIn, so this is a plain "in" glyph
 * (rounded square with the letters cut out), not the official logo file.
 */
const linkedinPath =
  "M5 2h14a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3zM6 7.3a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0zM6.2 10h2.6v8H6.2zM11 10h2.5v1.1c.5-.8 1.5-1.3 2.6-1.3 2 0 3 1.3 3 3.6V18h-2.6v-4.2c0-1.1-.4-1.8-1.4-1.8s-1.6.7-1.6 1.8V18H11z";

const paths: Record<BrandKey, string> = {
  python: siPython.path,
  fastapi: siFastapi.path,
  langchain: siLangchain.path,
  langgraph: siLanggraph.path,
  qdrant: siQdrant.path,
  postgresql: siPostgresql.path,
  docker: siDocker.path,
  react: siReact.path,
  nextdotjs: siNextdotjs.path,
  typescript: siTypescript.path,
  odoo: siOdoo.path,
  githubactions: siGithubactions.path,
  redis: siRedis.path,
  github: siGithub.path,
  huggingface: siHuggingface.path,
  linkedin: linkedinPath,
};

/** Server-only brand logo (keeps simple-icons out of client bundles). Decorative. */
export function BrandIcon({
  name,
  className,
}: {
  name: BrandKey;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d={paths[name]}
        fillRule={name === "linkedin" ? "evenodd" : undefined}
      />
    </svg>
  );
}
