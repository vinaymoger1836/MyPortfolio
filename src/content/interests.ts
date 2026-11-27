import { z } from "zod";
import { defineContent, interestSchema } from "./schema";

// Source: docs/content.md §8. Video games and Reading have no line yet.
export const interests = defineContent(
  z.array(interestSchema),
  [
    {
      title: "Applied GenAI",
      icon: "brain",
      line: "Building AI systems that are measured, guarded and actually useful. That's where my interest is strongest.",
    },
    {
      title: "Tools people actually use",
      icon: "users",
      line: "Software that non-technical teams can run on their own, without a developer in the loop.",
    },
    {
      title: "Manufacturing & operations",
      icon: "factory",
      line: "How factories, after-sales and RMA really work, and the software that keeps them running.",
    },
    { title: "Video games", icon: "gamepad" },
    { title: "Reading", icon: "book" },
  ],
  "interests.ts",
);
