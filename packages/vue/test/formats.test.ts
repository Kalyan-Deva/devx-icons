import { existsSync, readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const pkgs = new URL("../../", import.meta.url);
const has = (p: string) => existsSync(new URL(p, pkgs));

describe.runIf(has("vue/dist/index.js"))("@devx-icons/vue", async () => {
  const { createSSRApp, h } = await import("vue");
  const { renderToString } = await import("@vue/server-renderer");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { DevxIcon, dxHome, dxBellDot } = (await import("../dist/index.js")) as unknown as Record<string, any>;
  const render = (props: Record<string, unknown>) => renderToString(createSSRApp({ render: () => h(DevxIcon, props) }));

  it("renders every variant", async () => {
    expect(await render({ icon: dxHome })).toContain('stroke-width="1.75"');
    expect(await render({ icon: dxHome, variant: "solid" })).toContain('fill-rule="evenodd"');
    expect(await render({ icon: dxHome, variant: "duotone" })).toContain("devx-tint");
    expect(await render({ icon: dxHome, variant: "bulk" })).toContain('fill-opacity="0.35"');
  });
  it("weight, accent and animate", async () => {
    const out = await render({ icon: dxBellDot, weight: "light", accent: "#0ea5e9", animate: true });
    expect(out).toContain('stroke-width="1.25"');
    expect(out).toContain("--devx-accent:#0ea5e9");
    expect(out).toContain("dx-pulse");
  });
});

describe.runIf(has("elements/dist/runtime.js"))("shared runtime + web component data", async () => {
  const { devxSvg } = (await import("../../elements/dist/runtime.js")) as { devxSvg: (i: unknown, o?: unknown) => string };
  const home = (await import("../../elements/dist/icons/dxHome.js")).default;
  it("produces a complete SVG string per variant", () => {
    for (const variant of ["line", "solid", "duotone", "bulk"]) {
      const s = devxSvg(home, { variant });
      expect(s.startsWith("<svg")).toBe(true);
      expect(s).toContain('viewBox="0 0 24 24"');
    }
  });
  it("escapes attribute values", () => {
    expect(devxSvg(home, { color: '"><script>' })).not.toContain("<script>");
  });
});

describe.runIf(has("iconify/json/devx.json"))("Iconify sets", () => {
  it("has seven sets with every icon and valid bodies", () => {
    const files = readdirSync(new URL("iconify/json/", pkgs));
    expect(files.sort()).toEqual(["devx-bold.json", "devx-bulk.json", "devx-duotone.json", "devx-light.json", "devx-solid.json", "devx-thin.json", "devx.json"]);
    const set = JSON.parse(readFileSync(new URL("iconify/json/devx.json", pkgs), "utf8"));
    expect(set.prefix).toBe("devx");
    expect(Object.keys(set.icons).length).toBe(set.info.total);
    expect(set.icons.home.body.startsWith("<g")).toBe(true);
  });
});
