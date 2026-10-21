#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"
OUT="$PWD/out"
DEST="$PWD/.."

node render.cjs 192 60 "$OUT"

for s in winter spring summer fall; do
	ffmpeg -y -loglevel error -f rawvideo -pix_fmt rgba -s 192x192 -r 60 -i "$OUT/$s.raw" \
		-vf scale=768:768:flags=neighbor \
		-c:v libvpx-vp9 -pix_fmt yuva420p -crf 22 -b:v 0 -row-mt 1 \
		"$DEST/tree-$s.webm"

	ffmpeg -y -loglevel error -f rawvideo -pix_fmt rgba -s 192x192 -r 60 -i "$OUT/$s.raw" \
		-vf scale=768:768:flags=neighbor,format=bgra \
		-c:v hevc_videotoolbox -alpha_quality 0.9 -q:v 80 -tag:v hvc1 -movflags +faststart \
		"$DEST/tree-$s.mp4"
done

rm -rf "$OUT"
