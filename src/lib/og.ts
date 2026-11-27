import type { Accent } from "@/content/schema";

/**
 * Dark-theme token values for build-time images (next/og can't read CSS
 * variables). Keep in sync with src/styles/tokens.css.
 */
export const ogTokens = {
  bg: "#0A0B0D",
  surface: "#121418",
  surface2: "#1A1D23",
  border: "#262A31",
  text: "#ECEDEE",
  muted: "#8A9099",
} as const;

export const ogAccent: Record<Accent, string> = {
  lime: "#C6F135",
  violet: "#A78BFA",
};

type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 600;
  style: "normal";
};

/**
 * Fetches a Google font subset (TTF; Satori can't read WOFF2) for the given
 * text at build time. Returns null when offline, so the image falls back to
 * next/og's built-in font instead of failing the build.
 */
async function googleFont(family: string, weight: 400 | 600, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${family.replaceAll(" ", "+")}:wght@${weight}&text=${encodeURIComponent(text)}`;
  try {
    const css = await (await fetch(url)).text();
    const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!src) throw new Error("no TTF source in the Google Fonts CSS");
    const res = await fetch(src);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.arrayBuffer();
  } catch (error) {
    console.warn(`[og] ${family} ${weight} unavailable, using the default font:`, error);
    return null;
  }
}

/** Geist 600 (display), Geist 400 (body) and Geist Mono 400 (labels). */
export async function ogFonts(text: string): Promise<OgFont[]> {
  const [display, body, mono] = await Promise.all([
    googleFont("Geist", 600, text),
    googleFont("Geist", 400, text),
    googleFont("Geist Mono", 400, text),
  ]);
  const fonts: OgFont[] = [];
  if (display) fonts.push({ name: "Geist", data: display, weight: 600, style: "normal" });
  if (body) fonts.push({ name: "Geist", data: body, weight: 400, style: "normal" });
  if (mono) fonts.push({ name: "Geist Mono", data: mono, weight: 400, style: "normal" });
  return fonts;
}
