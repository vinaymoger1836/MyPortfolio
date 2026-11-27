import { DUR } from "@/components/motion/variants";

/** Length of the slide/blur swap between two roles, in ms. */
const SWAP = 450;

const pct = (n: number) => `${+n.toFixed(3)}%`;

/**
 * Keyframes for `n` roles: each role holds for 2.5s, then slides up and out
 * while the next slides up and in. A pre-blurred copy flashes during the swap
 * so the change reads as a blur, while only transform and opacity animate.
 */
function keyframes(n: number) {
  const cycle = n * DUR.rotator;
  const enter = (SWAP / cycle) * 100;
  const hold = (DUR.rotator / cycle) * 100;
  const exit = hold + enter;
  const mid = (a: number, b: number) => (a + b) / 2;
  return `
@keyframes rot-move-${n}{0%{transform:translateY(70%)}${pct(enter)},${pct(hold)}{transform:translateY(0)}${pct(exit)},100%{transform:translateY(-70%)}}
@keyframes rot-sharp-${n}{0%{opacity:0}${pct(enter)},${pct(hold)}{opacity:1}${pct(mid(hold, exit))},100%{opacity:0}}
@keyframes rot-blur-${n}{0%{opacity:0}${pct(enter / 2)}{opacity:.7}${pct(enter)},${pct(hold)}{opacity:0}${pct(mid(hold, exit))}{opacity:.7}${pct(exit)},100%{opacity:0}}`;
}

/**
 * Rotating role line (handoff §3/§5), CSS only: no JS, keeps turning even if
 * hydration fails. All roles share one grid cell, so the box is as wide as
 * the longest role and nothing shifts. Decorative: the static role list next
 * to it is the accessible text, and replaces it under reduced motion.
 */
export function RoleRotator({ roles, delay = 0 }: { roles: string[]; delay?: number }) {
  if (roles.length < 2) return null;
  const n = roles.length;
  const cycle = n * DUR.rotator;

  return (
    <span aria-hidden="true" className="rotator">
      <style>{keyframes(n)}</style>
      {roles.map((role, i) => {
        const timing = `${cycle}ms linear ${delay + i * DUR.rotator}ms infinite both`;
        return (
          <span
            key={role}
            className="rotator-item"
            style={{ animation: `rot-move-${n} ${timing}` }}
          >
            <span className="rotator-sharp" style={{ animation: `rot-sharp-${n} ${timing}` }}>
              {role}
            </span>
            <span className="rotator-blur" style={{ animation: `rot-blur-${n} ${timing}` }}>
              {role}
            </span>
          </span>
        );
      })}
    </span>
  );
}
