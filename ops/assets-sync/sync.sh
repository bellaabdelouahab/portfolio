#!/usr/bin/env bash
# Backs up the portfolio's uploaded assets (a Docker volume on this VPS) to the
# `uploads` branch of the GitHub repository, and writes the result to
# .sync-status.json inside the volume, where the back office reads it.
#
# - Additive only: files deleted from the volume are never deleted from the
#   backup, so a wiped or rebuilt VPS cannot erase it. History stays in git.
# - Runs from cron every 5 minutes and also when the back office drops a
#   `.sync-request` file into the volume.
# - If the volume is empty and the backup is not, the backup is restored first
#   (self-heal after a rebuild).
set -uo pipefail

VOLUME_NAME="${VOLUME_NAME:-scn4ghxwu7xdj2fpxf8terox-portfolio-uploads}"
REMOTE="${REMOTE:-https://github.com/bellaabdelouahab/portfolio.git}"
BRANCH="${BRANCH:-uploads}"
HOME_DIR="${SYNC_HOME:-$HOME/portfolio-sync}"
REPO="$HOME_DIR/repo"
LOG() { echo "$(date -u +%FT%TZ) $*"; }

mkdir -p "$HOME_DIR"
exec 9>"$HOME_DIR/.lock"
flock -n 9 || exit 0

VOL="$(sudo -n docker volume inspect "$VOLUME_NAME" --format '{{ .Mountpoint }}' 2>/dev/null)"
if [ -z "$VOL" ] || ! sudo -n test -d "$VOL"; then
  LOG "volume $VOLUME_NAME not found, nothing to do"
  exit 0
fi

STATUS_TMP="$HOME_DIR/status.json"
ERROR=""
PUSHED_AT=""
COMMIT=""

# Keep the previous push information when nothing new is pushed.
if sudo -n test -f "$VOL/.sync-status.json"; then
  PUSHED_AT="$(sudo -n cat "$VOL/.sync-status.json" | jq -r '.lastPushAt // ""')"
  COMMIT="$(sudo -n cat "$VOL/.sync-status.json" | jq -r '.lastCommit // ""')"
fi

setup_repo() {
  if [ ! -d "$REPO/.git" ]; then
    rm -rf "$REPO"
    if git ls-remote --exit-code --heads "$REMOTE" "$BRANCH" >/dev/null 2>&1; then
      git clone --quiet --branch "$BRANCH" --single-branch "$REMOTE" "$REPO" || return 1
    else
      git init --quiet "$REPO" && git -C "$REPO" checkout --quiet --orphan "$BRANCH" && git -C "$REPO" remote add origin "$REMOTE" || return 1
      printf '# Portfolio uploads backup\n\nFiles uploaded from the back office, copied here automatically by the VPS.\nRestore with ops/assets-sync/restore.sh.\n' > "$REPO/README.md"
      git -C "$REPO" add README.md && git -C "$REPO" commit --quiet -m "Start uploads backup" || return 1
    fi
  else
    git -C "$REPO" fetch --quiet origin "$BRANCH" 2>/dev/null && git -C "$REPO" reset --quiet --hard "origin/$BRANCH" 2>/dev/null || true
  fi
}

count_files() { find "$1" -type f ! -name '.*' 2>/dev/null | wc -l; }

if ! setup_repo; then
  ERROR="Could not prepare the backup repository (check GitHub access on the VPS)"
else
  # Restore into an empty volume.
  if [ "$(sudo -n find "$VOL" -type f ! -name '.*' | wc -l)" -eq 0 ] && [ "$(count_files "$REPO/images")$(count_files "$REPO/reports")" != "00" ]; then
    LOG "volume is empty, restoring from backup"
    for d in images reports; do [ -d "$REPO/$d" ] && sudo -n rsync -a "$REPO/$d/" "$VOL/$d/"; done
  fi

  # Volume -> repo (never deletes).
  for d in images reports; do
    if sudo -n test -d "$VOL/$d"; then
      mkdir -p "$REPO/$d"
      sudo -n rsync -a --exclude='.*' --chown="$(id -u):$(id -g)" "$VOL/$d/" "$REPO/$d/"
    fi
  done

  git -C "$REPO" add -A
  CHANGED="$(git -C "$REPO" status --porcelain | wc -l)"
  if [ "$CHANGED" -gt 0 ]; then
    if git -C "$REPO" commit --quiet -m "Backup: $CHANGED changed files"; then
      if git -C "$REPO" push --quiet origin "$BRANCH" 2>"$HOME_DIR/push.err" \
         || { git -C "$REPO" pull --quiet --rebase origin "$BRANCH" && git -C "$REPO" push --quiet origin "$BRANCH" 2>"$HOME_DIR/push.err"; }; then
        PUSHED_AT="$(date -u +%FT%TZ)"
        COMMIT="$(git -C "$REPO" rev-parse HEAD)"
        LOG "pushed $CHANGED files ($COMMIT)"
      else
        ERROR="Push to GitHub failed: $(tr '\n' ' ' < "$HOME_DIR/push.err" | cut -c1-200)"
      fi
    else
      ERROR="Commit failed"
    fi
  fi
fi

BACKED="$(( $(count_files "$REPO/images") + $(count_files "$REPO/reports") ))"
jq -n --arg ok "$([ -z "$ERROR" ] && echo true || echo false)" --arg err "$ERROR" \
      --arg run "$(date -u +%FT%TZ)" --arg push "$PUSHED_AT" --arg commit "$COMMIT" --argjson backed "$BACKED" \
  '{ok: ($ok == "true"), error: $err, lastRunAt: $run, lastPushAt: $push, lastCommit: $commit, backedUpFiles: $backed}' > "$STATUS_TMP"
sudo -n install -m 644 "$STATUS_TMP" "$VOL/.sync-status.json"
sudo -n rm -f "$VOL/.sync-request"
