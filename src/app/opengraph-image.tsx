import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";
import { site } from "@/content/site";
import { ogAccent, ogFonts, ogTokens as t } from "@/lib/og";
import { fill } from "@/lib/utils";

/**
 * Home share image (1200×630), generated at build: monogram, name, role and
 * availability on the dark surface, with the site's accent.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = fill(site.ui.seo.homeOgAlt, { name: profile.name, role: profile.role });

export default async function Image() {
  const accent = ogAccent[site.accent];
  const pill = profile.availability.label;
  const host = new URL(site.url).host;
  const text = [profile.name, profile.role, pill, profile.shortName, profile.location, host, "·"].join(" ");
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
        {/* Accent strokes, as on the project images. */}
        <div style={{ position: "absolute", top: 0, right: 96, width: 2, height: "100%", background: accent, opacity: 0.55 }} />
        <div style={{ position: "absolute", right: 0, bottom: 150, width: 420, height: 2, background: accent, opacity: 0.55 }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 940 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 72, height: 72, borderRadius: 16, border: `2px solid ${accent}`, fontFamily: "Geist Mono", fontSize: 28, letterSpacing: 3, color: t.text }}>
            {profile.shortName}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 22px", borderRadius: 999, border: `1px solid ${t.border}`, background: t.surface2, fontSize: 24, color: t.text }}>
            <div style={{ width: 14, height: 14, borderRadius: 999, background: accent }} />
            {pill}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 960 }}>
          <div style={{ fontSize: 104, fontWeight: 600, letterSpacing: -4, lineHeight: 1 }}>{profile.name}</div>
          <div style={{ marginTop: 28, fontSize: 34, lineHeight: 1.3, color: accent, fontWeight: 400 }}>{profile.role}</div>
        </div>

        <div style={{ display: "flex", gap: 16, fontFamily: "Geist Mono", fontSize: 22, color: t.muted, letterSpacing: 2, textTransform: "uppercase" }}>
          <span>{profile.location}</span>
          <span style={{ color: accent }}>·</span>
          <span style={{ textTransform: "none" }}>{host}</span>
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts(glyphs) },
  );
}
