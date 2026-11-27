import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { motionCssVars } from "@/components/motion/cssVars";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import {
  speculationRules,
  viewTransitionScript,
} from "@/components/motion/viewTransitionScript";
import { site } from "@/content/site";
import { rootMetadata } from "@/lib/seo";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
});

export const metadata = rootMetadata;

// Vercel Web Analytics + Speed Insights only on Vercel builds: elsewhere
// their /_vercel/* scripts don't exist (404s in local runs and tests).
const onVercel = Boolean(process.env.VERCEL);

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-accent={site.accent}
      suppressHydrationWarning
      style={motionCssVars}
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
    >
      <head>
        {/* Must run before first render to catch `pagereveal`. */}
        <script dangerouslySetInnerHTML={{ __html: viewTransitionScript }} />
        <script
          type="speculationrules"
          dangerouslySetInnerHTML={{ __html: speculationRules }}
        />
      </head>
      <body className="min-h-dvh bg-bg font-sans text-text">
        <ThemeProvider>{children}</ThemeProvider>
        <RevealObserver />
        <SmoothScroll />
        {onVercel && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
