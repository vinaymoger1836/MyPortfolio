import { profile } from "@/content/profile";
import { site } from "@/content/site";
import { monogramIcon, ogAccent } from "@/lib/og";

// Home-screen icon for iOS (PNG, prerendered), in the site's accent.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return monogramIcon(size.width, ogAccent[site.accent], profile.shortName);
}
