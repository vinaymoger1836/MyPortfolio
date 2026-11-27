import { profile } from "@/content/profile";
import { site } from "@/content/site";
import { monogramIcon, ogAccent } from "@/lib/og";

// Favicon (PNG, prerendered), in the site's accent.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return monogramIcon(size.width, ogAccent[site.accent], profile.shortName);
}
