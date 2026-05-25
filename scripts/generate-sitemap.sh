#!/usr/bin/env bash
# Regenerates sitemap.xml from the root-level *.html files in the repo.
# lastmod for each page is taken from its most recent git commit date.
set -euo pipefail

BASE_URL="https://theinfrastructureinvestor.com"
OUT="sitemap.xml"

cd "$(git rev-parse --show-toplevel)"

{
  echo '<?xml version="1.0" encoding="UTF-8"?>'
  echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  while IFS= read -r f; do
    lastmod="$(git log -1 --format=%cs -- "$f" 2>/dev/null || true)"
    [ -z "$lastmod" ] && lastmod="$(date +%F)"
    if [ "$f" = "index.html" ]; then
      loc="$BASE_URL/"
    else
      loc="$BASE_URL/$f"
    fi
    echo '  <url>'
    echo "    <loc>${loc}</loc>"
    echo "    <lastmod>${lastmod}</lastmod>"
    echo '  </url>'
  done < <(find . -maxdepth 1 -name '*.html' -type f | sed 's|^\./||' | sort)
  echo '</urlset>'
} > "$OUT"

echo "Generated ${OUT}:"
cat "$OUT"
