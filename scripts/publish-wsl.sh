#!/usr/bin/env bash
# Publishes the DevX Icons tarballs to npm from WSL (Windows npm has a stale token in
# C:\Users\kalya\.npmrc). The account uses browser approval: npm prints an npmjs.com link per
# package, which this script opens in the Windows browser for you to approve.
# Usage: publish-wsl.sh            all seven
#        publish-wsl.sh -react     just these (suffixes: "" -font -iconify -react -vue -svelte -elements)
set -u
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

LIST=("" -font -iconify -react -vue -svelte -elements)
[ $# -gt 0 ] && LIST=("$@")
FAILED=""
for s in "${LIST[@]}"; do
  name="@kalyan-dev/devx-icons$s"
  file="kalyan-dev-devx-icons$s-$VER.tgz"
  if [ "$(npm view "$name@$VER" version 2>/dev/null)" = "$VER" ]; then
    echo "$name@$VER already published"
    continue
  fi
  echo
  echo "== Publishing $name@$VER (big packages take a few minutes before the approval link) =="
  # script(1) gives npm a real terminal, which browser approval needs, while we:
  #  - drop the per-file listing (60k+ lines for big packages buries the approval link)
  #  - open the approval page in the Windows browser as soon as npm prints it
  script -qefc "npm publish $file --access public --auth-type=web" /dev/null \
    | tr -d '\r' \
    | grep --line-buffered -vE 'npm notice [0-9.]+[kMG]?B ' \
    | while IFS= read -r line; do
        echo "$line"
        case "$line" in
          *https://www.npmjs.com/auth/cli/*)
            url="https://www.npmjs.com/auth/cli/${line##*https://www.npmjs.com/auth/cli/}"
            echo ">> Opening the approval page in your browser: approve it now."
            /mnt/c/Windows/explorer.exe "$url" >/dev/null 2>&1 &
            ;;
        esac
      done
  if [ "${PIPESTATUS[0]}" -eq 0 ]; then
    echo "Published $name"
  else
    echo "Not published: $name. Re-run with: publish-wsl.sh $s"
    FAILED="$FAILED $name"
  fi
done
echo
if [ -z "$FAILED" ]; then echo "Done: all requested DevX Icons packages are on npm."; else echo "Still to retry:$FAILED"; fi
