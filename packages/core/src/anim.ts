// Rule-based motion for the animated style. Every icon gets exactly one kind.

export type AnimKind = "draw" | "spin" | "swing" | "beat" | "nudge" | "pulse" | "pop";
export interface Anim {
  kind: AnimKind;
  /** nudge direction in px (icon units) */
  dx?: number;
  dy?: number;
}

const SPIN = /^(settings|refresh|rotate-cw|rotate-ccw|sync|reset|loader|loader-circle|aperture|cluster|cipher|disc|vinyl|globe|planet|post-quantum|debug|radar)$/;
const SWING = /^(bell|bell-ring|alarm-clock|siren|notification-card)$/;
const BEAT = /^(heart|heart-pulse|activity)$/;

function nudgeDir(name: string): [number, number] | null {
  const n = name;
  const d = (x: number, y: number): [number, number] => [x, y];
  if (/up-right/.test(n)) return d(1.5, -1.5);
  if (/up-left/.test(n)) return d(-1.5, -1.5);
  if (/down-right/.test(n)) return d(1.5, 1.5);
  if (/down-left/.test(n)) return d(-1.5, 1.5);
  if (/(^|-)(right|forward|next|log-in|import|send|external-link|redo|fast-forward|skip-forward|export|log-out)(-|$)/.test(n)) return d(2, 0);
  if (/(^|-)(left|back|reply|undo|rewind|skip-back)(-|$)/.test(n)) return d(-2, 0);
  if (/(^|-)(up|upload|arrow-up-from-line|sort-ascending)(-|$)/.test(n)) return d(0, -2);
  if (/(^|-)(down|download|arrow-down-to-line|sort-descending)(-|$)/.test(n)) return d(0, 2);
  return null;
}

export function animFor(name: string, base: string, variant: string | null, category: string): Anim {
  if (variant === "dot") return { kind: "pulse" };
  if (variant) return { kind: "pop" };
  if (SPIN.test(base)) return { kind: "spin" };
  if (SWING.test(base)) return { kind: "swing" };
  if (BEAT.test(base)) return { kind: "beat" };
  if (category === "arrows" || /^(download|upload|send|import|export|log-in|log-out|external-link)$/.test(base)) {
    const d = nudgeDir(name);
    if (d) return { kind: "nudge", dx: d[0], dy: d[1] };
  }
  return { kind: "draw" };
}

/** One stylesheet drives every animated icon (SVG files embed it; React/Vue ship it as CSS). */
export const ANIM_CSS = `@keyframes dx-draw{0%,12%{stroke-dashoffset:1}55%,100%{stroke-dashoffset:0}}
@keyframes dx-spin{0%{transform:rotate(0)}65%,100%{transform:rotate(360deg)}}
@keyframes dx-swing{0%,55%,100%{transform:rotate(0)}10%{transform:rotate(14deg)}20%{transform:rotate(-12deg)}30%{transform:rotate(8deg)}40%{transform:rotate(-4deg)}}
@keyframes dx-beat{0%,45%,100%{transform:scale(1)}15%{transform:scale(1.12)}30%{transform:scale(.96)}}
@keyframes dx-nudge{0%,50%,100%{transform:translate(0,0)}25%{transform:translate(var(--dx,2px),var(--dy,0px))}}
@keyframes dx-pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.35);opacity:.55}}
@keyframes dx-pop{0%{transform:scale(.4);opacity:0}16%{transform:scale(1);opacity:1}100%{transform:scale(1);opacity:1}}
.dx-draw .devx-accent{stroke-dasharray:1;animation:dx-draw 2.6s ease-in-out infinite}
.dx-spin .dx-g{transform-origin:12px 12px;animation:dx-spin 2.6s cubic-bezier(.65,0,.35,1) infinite}
.dx-swing .dx-g{transform-origin:12px 3px;animation:dx-swing 2.6s ease-in-out infinite}
.dx-beat .dx-g{transform-origin:12px 12px;animation:dx-beat 1.8s ease-in-out infinite}
.dx-nudge .dx-g{animation:dx-nudge 1.8s ease-in-out infinite}
.dx-pulse .devx-accent{transform-box:fill-box;transform-origin:center;animation:dx-pulse 1.6s ease-in-out infinite}
.dx-pop .devx-accent{transform-box:fill-box;transform-origin:center;animation:dx-pop 2.6s cubic-bezier(.3,1.6,.5,1) infinite}
@media (prefers-reduced-motion:reduce){.dx-g,.devx-accent{animation:none!important}}`;
