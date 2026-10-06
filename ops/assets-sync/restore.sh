#!/usr/bin/env bash
# Copies the GitHub backup (branch `uploads`) back into the uploads volume.
# Existing files in the volume are overwritten by the backup copy.
set -euo pipefail
VOLUME_NAME="${VOLUME_NAME:-scn4ghxwu7xdj2fpxf8terox-portfolio-uploads}"
REMOTE="${REMOTE:-https://github.com/bellaabdelouahab/portfolio.git}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
sudo docker volume inspect "$VOLUME_NAME" >/dev/null 2>&1 || sudo docker volume create "$VOLUME_NAME" >/dev/null
VOL="$(sudo docker volume inspect "$VOLUME_NAME" --format '{{ .Mountpoint }}')"
git clone --quiet --depth 1 --branch uploads "$REMOTE" "$TMP/repo"
for d in images reports; do
  [ -d "$TMP/repo/$d" ] && sudo rsync -a "$TMP/repo/$d/" "$VOL/$d/"
done
echo "Restored $(sudo find "$VOL" -type f ! -name '.*' | wc -l) files into $VOL"
