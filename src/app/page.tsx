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
import { JsonLd } from "@/components/ui/JsonLd";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { homeMetadata, personJsonLd } from "@/lib/seo";

export const metadata = homeMetadata;

// Sections in handoff §3 order. Each one hides itself when its content is empty.
export default function Home() {
  return (
    <>
      <SiteHeader />
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
      <JsonLd data={personJsonLd()} />
    </>
  );
}
