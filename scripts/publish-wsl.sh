#!/usr/bin/env bash
# Publishes the seven DevX Icons tarballs to npm from WSL (Windows npm has a stale token in
# C:\Users\kalya\.npmrc). npm prints a link for login and for each publish: open it in your
# browser and approve. Re-run to retry; already-published packages are skipped.
set -u
# Let npm's "Press ENTER to open in the browser" open the Windows default browser.
export BROWSER="/mnt/c/Windows/explorer.exe"
SRC="/mnt/c/Users/kalya/Documents/Code Projects/DevX-Icons/release/npm"
VER=1.2.0
WORK=/tmp/devx-npm
rm -rf "$WORK" && mkdir -p "$WORK" && cp "$SRC"/*.tgz "$WORK"/ && cd "$WORK" || exit 1

if ! npm whoami >/dev/null 2>&1; then
  echo "Log in to npm: open the link below in your browser and sign in as kalyandev."
  npm login --auth-type=web || exit 1
fi
echo "Logged in to npm as $(npm whoami)"

FAILED=""
# Optional args pick packages, e.g. "-react -vue"; default = all seven.
LIST=("" -font -iconify -react -vue -svelte -elements)
[ $# -gt 0 ] && LIST=("$@")
for s in "${LIST[@]}"; do
  name="@kalyan-dev/devx-icons$s"
  file="kalyan-dev-devx-icons$s-$VER.tgz"
  if [ "$(npm view "$name@$VER" version 2>/dev/null)" = "$VER" ]; then
    echo "$name@$VER already published"
    continue
  fi
  echo
  echo "== Publishing $name@$VER: open the link npm prints and approve =="
  if npm publish "$file" --access public --auth-type=web; then
    echo "Published $name"
  else
    echo "Not published: $name (if npm says it is staged, approve it on npmjs.com). Continuing."
    FAILED="$FAILED $name"
  fi
done
echo
if [ -z "$FAILED" ]; then echo "All 7 DevX Icons packages are on npm."; else echo "Still to approve or retry:$FAILED"; fi
