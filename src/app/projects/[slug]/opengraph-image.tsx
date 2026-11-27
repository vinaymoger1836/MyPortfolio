import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { profile } from "@/content/profile";
import { getProject, projects } from "@/content/projects";
import { site } from "@/content/site";
import { ogAccent, ogFonts, ogTokens as t } from "@/lib/og";
import { fill } from "@/lib/utils";

/**
 * Per-project share image (1200×630), generated at build. Same visual
 * system as the typographic covers: title in display type, tagline, stack
 * chips and an accent stroke on the dark surface.
 */
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = fill(site.ui.caseStudy.ogAlt, { name: profile.name });

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const accent = ogAccent[site.accent];
  const status = site.ui.projects.status[project.status];
  // One row of chips; very long entries (e.g. an AWS service list) are skipped.
  const stack = project.stack.filter((s) => s.length <= 28).slice(0, 5);
  // Font subset: every glyph drawn, including the uppercased mono row.
  const text = [project.title, project.tagline, status, profile.name, profile.shortName, "/", ...stack].join(" ");
  const glyphs = `${text}${text.toUpperCase()}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: t.bg,
          color: t.text,
          fontFamily: "Geist",
          position: "relative",
        }}
      >
        {/* Accent strokes, as on the generated covers. */}
        <div style={{ position: "absolute", top: 0, right: 96, width: 2, height: "100%", background: accent, opacity: 0.55 }} />
        <div style={{ position: "absolute", right: 0, bottom: 150, width: 420, height: 2, background: accent, opacity: 0.55 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: "Geist Mono", fontSize: 22, color: t.muted, letterSpacing: 2, textTransform: "uppercase" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: 12, border: `2px solid ${accent}`, color: t.text, letterSpacing: 3 }}>
            {profile.shortName}
          </div>
          <span>{profile.name}</span>
          <span style={{ color: accent }}>/</span>
          <span>{status}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 940 }}>
          <div style={{ fontSize: 104, fontWeight: 600, letterSpacing: -4, lineHeight: 1 }}>{project.title}</div>
          <div style={{ marginTop: 24, fontSize: 32, lineHeight: 1.35, color: t.muted, fontWeight: 400, maxHeight: 130, overflow: "hidden" }}>
            {project.tagline}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, maxWidth: 960, overflow: "hidden", fontFamily: "Geist Mono", fontSize: 20 }}>
          {stack.map((s) => (
            <div key={s} style={{ display: "flex", padding: "8px 16px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface2, color: t.text }}>
              {s}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts(glyphs) },
  );
}
