import { existsSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

const built = existsSync(new URL("../dist/index.js", import.meta.url));

describe.runIf(built)("@devx-icons/react", async () => {
  const mod = await import("../dist/index.js");
  const { HomeIcon, HomeSolidIcon, BellDotIcon } = mod as unknown as Record<string, React.FC<Record<string, unknown>>>;

  it("exports a line and a solid component per icon", () => {
    const names = Object.keys(mod);
    expect(names.length).toBeGreaterThan(8000);
    expect(names).toContain("HomeIcon");
    expect(names).toContain("HomeSolidIcon");
  });
  it("renders a line icon with stroke props and is aria-hidden by default", () => {
    const html = renderToStaticMarkup(createElement(HomeIcon!, { size: 32, strokeWidth: 2 }));
    expect(html).toContain('width="32"');
    expect(html).toContain('stroke-width="2"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain("devx-accent");
  });
  it("renders a solid icon with fills", () => {
    const html = renderToStaticMarkup(createElement(HomeSolidIcon!, {}));
    expect(html).toContain('fill="currentColor"');
    expect(html).not.toContain("stroke-width");
  });
  it("accent prop sets the CSS variable; title makes it accessible", () => {
    const html = renderToStaticMarkup(createElement(BellDotIcon!, { accent: "#e11d48", title: "New notifications" }));
    expect(html).toContain("--devx-accent:#e11d48");
    expect(html).toContain("<title>New notifications</title>");
    expect(html).toContain('role="img"');
  });
});
