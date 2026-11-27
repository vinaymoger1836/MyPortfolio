import {
  BookOpen,
  BrainCircuit,
  Cloud,
  Database,
  Factory,
  FlaskConical,
  Gamepad2,
  LayoutTemplate,
  Plug,
  Server,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { IconKey } from "@/content/schema";

/** Icon keys usable in content files (validated by `iconSchema`). */
export const icons: Record<IconKey, LucideIcon> = {
  sparkles: Sparkles,
  server: Server,
  database: Database,
  cloud: Cloud,
  flask: FlaskConical,
  layout: LayoutTemplate,
  plug: Plug,
  factory: Factory,
  users: Users,
  gamepad: Gamepad2,
  book: BookOpen,
  brain: BrainCircuit,
};
