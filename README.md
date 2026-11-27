# Vinayakumar Moger: Portfolio

The personal portfolio of **Vinayakumar Moger**, a software developer in Bengaluru working on Python, GenAI and agentic systems.

**Live:** https://vinayakumar-moger.vercel.app

I'm open to **full-time roles** (Full Stack, Backend in Python, or GenAI Engineer) and **freelance projects**. Reach me at vinaymoger1836@gmail.com or through the contact form on the site.

> **Status:** Phase 2. Every home-page section renders from the content files in `src/content/`, with scroll reveals, hover effects and smooth scrolling (all off or reduced to fades under reduced motion). Case-study pages land in Phase 3 and the contact form wiring in Phase 4 (until then the form opens a prefilled email).

---

## What's on the site

- **Projects**: case studies for Automiq, Lumina, AskDB, URLGen, Map.io, Imagify and TaskFlow, each with the problem, approach, stack and measured outcomes
- **Experience**: production work at Zimplistic India (Odoo v17, Python backends, AWS, MCP and LangGraph agents)
- **Skills**, **What I can help with** (freelance), **Interests** and **Contact**
- A downloadable **resume** at `/resume.pdf`

## Tech stack

| Area | Tools |
|---|---|
| Framework | Next.js (App Router), TypeScript, statically prerendered |
| Styling | Tailwind CSS v4, CSS-variable design tokens (dark/light, lime/violet accent presets) |
| Motion | CSS animations + small handlers (Web Animations API for the filter reflow), Lenis smooth scroll, View Transitions API |
| Content | Typed TypeScript files validated with zod |
| Contact | Web3Forms (client-side), with a mailto fallback |
| Quality | ESLint, `tsc`, Playwright smoke tests, axe, Lighthouse CI |
| Hosting | Vercel Hobby (free), Vercel Web Analytics + Speed Insights |

Animations respect `prefers-reduced-motion`, and the site stays readable with JavaScript disabled. The target is a mobile Lighthouse score of 95 or more in all four categories.

## Run locally

Requires Node 22+ and pnpm 11 (`corepack enable` picks up the pinned version).

```bash
pnpm install
cp .env.example .env.local      # optional: add NEXT_PUBLIC_WEB3FORMS_KEY for the contact form
pnpm dev                        # http://localhost:3000
```

| Command | What it does |
|---|---|
| `pnpm dev` | Start the dev server |
| `pnpm build` | Production build (fails if content is invalid) |
| `pnpm start` | Serve the production build on port 3000 |
| `pnpm lint` / `pnpm typecheck` | Lint and type-check |
| `pnpm size` | Home-page JS (gzipped) against the budget; fails if over (run `pnpm build` first) |
| `pnpm test:e2e` | Playwright smoke tests against the production build (run `pnpm build` first) |

Before the first e2e run, download the test browser once: `pnpm exec playwright install chromium`.

Without a Web3Forms key, the contact form falls back to opening an email.

## Updating content

All text, links and numbers live in **`src/content/`**, so you never need to edit components.

| File | What it controls |
|---|---|
| `profile.ts` | Name, headline, pitch, bio, availability, quick facts, socials, photo |
| `skills.ts` | Skill groups (core / familiar) and the logo marquee |
| `projects.ts` | Project cards and case-study pages |
| `experience.ts` | Work, education, certifications |
| `services.ts` | The "What I can help with" section |
| `interests.ts` | Interests |
| `testimonials.ts` | Testimonials (the section hides when empty) |
| `sections.ts` | Section order, nav labels and headings |
| `site.ts` | Site URL, SEO, accent preset (`'lime'` or `'violet'`), contact provider, interface labels |

Common edits:
- **A project goes live:** in `projects.ts`, change its `live: 'coming-soon'` to the URL.
- **Add a photo:** put it in `public/images/profile/` and set `photo` in `profile.ts`.
- **Update the resume:** replace `public/resume.pdf`.
- **Switch the accent:** change `accent` in `site.ts`.
- **Hide a section:** empty its array (for example `testimonials.ts`); it disappears from the page and the nav, and the section numbers close up.

Every content file is validated at build time, so a typo or a missing `alt` text fails the build with a clear message instead of breaking the page.

## Deploy

The repo is connected to Vercel. A push to `main` deploys to production, and each pull request gets a preview URL. Set `NEXT_PUBLIC_WEB3FORMS_KEY` under **Vercel → Project → Settings → Environment Variables**, along with `ENABLE_EXPERIMENTAL_COREPACK=1` so Vercel builds with the pnpm version pinned in `package.json`.

## Project structure

```
src/app/          routes: home, /projects/[slug], sitemap, robots, OG images
src/components/   sections/, ui/, motion/
src/content/      all site content (edit here)
src/styles/       design tokens and global styles
public/           images, resume.pdf, favicons
docs/             private working notes (local only, not in the repo)
tests/            Playwright smoke tests
```

## Built with Claude Code

The site was designed in a planning session and built in phases with Claude Code. `claude-code-handoff.md` holds the design and phase plan, and `CLAUDE.md` holds the standing rules.

## License

The code is MIT licensed. The content (text, resume, images) is © Vinayakumar Moger, all rights reserved. Please don't reuse it as your own.
