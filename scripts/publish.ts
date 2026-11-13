// Publishes the packed release tarballs (release/npm/*.tgz) to npm, in dependency-free order.
// Prereqs: `npm login` as a member of the kalyan-dev organisation.
// Packages publish under the @kalyan-dev organisation. Pass --dry-run to check without publishing.
// npm may ask for a one-time password if 2FA is on: pass --otp=123456.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url)).replace(/[\\/]$/, "");
const v = JSON.parse(readFileSync(`${root}/packages/svg/package.json`, "utf8")).version as string;
const dry = process.argv.includes("--dry-run");
const otp = process.argv.find((a) => a.startsWith("--otp="));
const npm = process.platform === "win32" ? "npm.cmd" : "npm";

const order = ["", "-font", "-iconify", "-react", "-vue", "-svelte", "-elements"].map((s) => `kalyan-dev-devx-icons${s}`);
const run = (args: string[]) => execFileSync(npm, args, { stdio: "pipe", shell: process.platform === "win32" }).toString().trim();

try {
  console.log(`npm user: ${run(["whoami"])}`);
} catch {
  console.error("Not logged in to npm. Run `npm login` first.");
  process.exit(1);
}

for (const base of order) {
  const file = `${root}/release/npm/${base}-${v}.tgz`;
  if (!existsSync(file)) {
    console.error(`missing ${file} — run pnpm release first`);
    process.exit(1);
  }
  const args = ["publish", `"${file}"`, "--access", "public"];
  if (dry) args.push("--dry-run");
  if (otp) args.push(otp);
  process.stdout.write(`${dry ? "[dry] " : ""}publishing ${base}@${v} … `);
  try {
    run(args);
    console.log("ok");
  } catch (e) {
    const msg = String((e as { stderr?: Buffer }).stderr ?? e);
    if (/previously published|cannot publish over/i.test(msg)) console.log("already published");
    else {
      console.log("failed");
      console.error(msg.split("\n").filter((l) => /error/i.test(l)).slice(0, 6).join("\n"));
      process.exit(1);
    }
  }
}
console.log(dry ? "dry run complete" : `published ${order.length} packages`);
