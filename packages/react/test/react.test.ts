import { existsSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

const built = existsSync(new URL("../dist/index.js", import.meta.url));
type C = React.FC<Record<string, unknown>>;

describe.runIf(built)("@devx-icons/react", async () => {
  const mod = (await import("../dist/index.js")) as unknown as Record<string, C>;
  const { HomeIcon, HomeSolidIcon, HomeDuotoneIcon, HomeBulkIcon, BellDotIcon, SettingsIcon } = mod;
  const html = (c: C | undefined, p: Record<string, unknown> = {}) => renderToStaticMarkup(createElement(c!, p));

  it("exports line, solid, duotone and bulk components for every icon", () => {
    const names = Object.keys(mod);
    expect(names.length).toBeGreaterThan(28000);
    for (const n of ["HomeIcon", "HomeSolidIcon", "HomeDuotoneIcon", "HomeBulkIcon"]) expect(names).toContain(n);
  });
  it("line: stroke props, aria-hidden by default, accent path", () => {
    const h = html(HomeIcon, { size: 32, strokeWidth: 2 });
    expect(h).toContain('width="32"');
    expect(h).toContain('stroke-width="2"');
    expect(h).toContain('aria-hidden="true"');
    expect(h).toContain("devx-accent");
  });
  it("weight maps to the stroke width", () => {
    expect(html(HomeIcon, { weight: "thin" })).toContain('stroke-width="1"');
    expect(html(HomeIcon, { weight: "bold" })).toContain('stroke-width="2.25"');
  });
  it("solid fills; bulk fades the body; duotone adds a tint under the line", () => {
    const s = html(HomeSolidIcon);
    expect(s).toContain('fill="currentColor"');
    expect(s).not.toContain("stroke-width");
    expect(html(HomeBulkIcon)).toContain('fill-opacity="0.35"');
    const d = html(HomeDuotoneIcon);
    expect(d).toContain("devx-tint");
    expect(d).toContain('stroke-width="1.75"');
  });
  it("accent prop sets the CSS variable; title makes it accessible", () => {
    const h = html(BellDotIcon, { accent: "#e11d48", title: "New notifications" });
    expect(h).toContain("--devx-accent:#e11d48");
    expect(h).toContain("<title>New notifications</title>");
    expect(h).toContain('role="img"');
  });
  it("animate embeds the motion CSS and the rule-picked kind", () => {
    const h = html(SettingsIcon, { animate: true });
    expect(h).toContain("dx-spin");
    expect(h).toContain("@keyframes dx-spin");
    expect(h).toContain('class="dx-g"');
    expect(h).toContain("prefers-reduced-motion");
  });
});
