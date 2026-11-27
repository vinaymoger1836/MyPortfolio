import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Interests } from "@/components/sections/Interests";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { Skills } from "@/components/sections/Skills";
import { Testimonials } from "@/components/sections/Testimonials";
import { Nav } from "@/components/ui/Nav";
import { profile } from "@/content/profile";
import { site } from "@/content/site";
import { visibleSections } from "@/lib/sections";

// Sections in handoff §3 order. Each one hides itself when its content is empty.
export default function Home() {
  const { ui } = site;
  const links = visibleSections
    .filter((s) => s.navLabel)
    .map((s) => ({ id: s.id, label: s.navLabel ?? s.label }));

  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-accent px-4 py-2 font-medium text-accent-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {ui.skipToContent}
      </a>
      <Nav
        name={profile.name}
        shortName={profile.shortName}
        links={links}
        labels={{
          primaryNav: ui.primaryNav,
          hireMe: ui.hireMe,
          themeToggle: ui.themeToggle,
          menuOpen: ui.menuOpen,
          menuClose: ui.menuClose,
        }}
      />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Services />
        <Interests />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
