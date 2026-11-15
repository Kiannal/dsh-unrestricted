#!/bin/sh
set -eu
src=$(cd "$(dirname "$0")" && pwd)
dest="$HOME/.dsh/skills/dsh-unrestricted"
mkdir -p "$dest"
cp "$src/SKILL.md" "$dest/SKILL.md"
cp "$src/contract.md" "$dest/contract.md"
grep -q '^name: dsh-unrestricted' "$dest/SKILL.md"
echo "installed -> $dest"
echo "restart DSH, then say: 破甲"