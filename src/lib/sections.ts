import { experience } from "@/content/experience";
import { interests } from "@/content/interests";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import type { Section, SectionId } from "@/content/schema";
import { sections } from "@/content/sections";
import { services } from "@/content/services";
import { skills } from "@/content/skills";
import { testimonials } from "@/content/testimonials";
import { pad2 } from "./utils";

/** A section hides itself when it has nothing to show. */
const hasContent: Record<SectionId, boolean> = {
  about: profile.bio.length > 0,
  skills: skills.groups.length > 0,
  projects: projects.length > 0,
  experience:
    experience.entries.length > 0 || experience.certifications.length > 0,
  services: services.length > 0,
  interests: interests.length > 0,
  testimonials: testimonials.length > 0,
  contact: true,
};

export type VisibleSection = Section & { number: string };

/** Sections that render, in order, numbered from 01. */
export const visibleSections: VisibleSection[] = sections
  .filter((s) => hasContent[s.id])
  .map((s, i) => ({ ...s, number: pad2(i + 1) }));

export function getSection(id: SectionId): VisibleSection | undefined {
  return visibleSections.find((s) => s.id === id);
}
