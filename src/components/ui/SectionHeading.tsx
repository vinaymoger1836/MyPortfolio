import type { VisibleSection } from "@/lib/sections";

/** "01 / About" label, then the h2 with an optional serif-italic phrase. */
export function SectionHeading({ section }: { section: VisibleSection }) {
  const { text, emphasis } = section.heading;
  const at = emphasis ? text.indexOf(emphasis) : -1;

  return (
    <header className="mb-10 max-w-[65ch] md:mb-14">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
        {section.number} / {section.label}
      </p>
      <h2
        id={`${section.id}-heading`}
        className="mt-4 text-[clamp(2rem,5.5vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-balance"
      >
        {at >= 0 && emphasis ? (
          <>
            {text.slice(0, at)}
            <em className="font-serif font-normal tracking-normal text-accent">
              {emphasis}
            </em>
            {text.slice(at + emphasis.length)}
          </>
        ) : (
          text
        )}
      </h2>
      {section.intro && (
        <p className="mt-5 text-muted text-pretty">{section.intro}</p>
      )}
    </header>
  );
}
