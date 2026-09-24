#!/usr/bin/env bash
# Regenerates photos/thumbs/*.webp (360px-wide) from every photos/NN.webp present.
# Missing indexes are skipped automatically. Run: ./gen_thumbs.sh

set -euo pipefail
cd "$(dirname "$0")"

mkdir -p photos/thumbs

for f in photos/[0-9]*.webp; do
  base="$(basename "$f" .webp)"
  ffmpeg -hide_banner -loglevel error -i "$f" \
    -vf "scale=360:-2" -q:v 70 "photos/thumbs/$base.webp" -y
done

echo "Generated $(ls photos/thumbs/*.webp | wc -l) thumbnails in photos/thumbs/"