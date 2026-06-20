#!/usr/bin/env node
/* Regenerates the PROJECTS array in site.js, the searchable, deep-linkable list
 * of individual worked assets (HS2, Heathrow, Rotterdam, …) embedded in the
 * reference pages' <select id="ixSelect"> pickers.
 *
 * Each reference page hard-codes its six worked examples as <option> elements;
 * this scans them and emits { t: <project name>, u: <page>#ex=<key>, g: <sub-sector> }
 * so the command palette can find a project and jump straight to it with the
 * right asset pre-selected.
 *
 * Run from the repo root:  node scripts/generate-search-index.js
 */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sitejsPath = path.join(root, 'site.js');
let sitejs = fs.readFileSync(sitejsPath, 'utf8');

/* page -> human title, from the existing INDEX array in site.js */
const indexMatch = sitejs.match(/var INDEX = (\[[\s\S]*?\]);/);
if (!indexMatch) { console.error('Could not find INDEX array in site.js'); process.exit(1); }
const INDEX = JSON.parse(indexMatch[1]);
const titleOf = {};
INDEX.forEach((e) => { titleOf[e.u] = e.t; });

function decode(s) {
  return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
          .replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
}
/* project name = the part of the option label before the first separator */
function projectName(label) {
  const txt = decode(label);
  const cut = txt.split(/\s[·|–—]\s/)[0];
  return (cut || txt).trim();
}

const files = fs.readdirSync(root).filter((f) => f.endsWith('.html'));
const projects = [];
const seen = new Set();

files.forEach((file) => {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const sel = html.match(/<select id="ixSelect"[^>]*>([\s\S]*?)<\/select>/);
  if (!sel) return;
  const group = titleOf[file] || file.replace(/\.html$/, '').replace(/-/g, ' ');
  const optRe = /<option value="([^"]*)"[^>]*>([\s\S]*?)<\/option>/g;
  let m;
  while ((m = optRe.exec(sel[1]))) {
    const key = m[1].trim();
    if (!key) continue;
    const name = projectName(m[2]);
    if (!name) continue;
    const u = file + '#ex=' + key;
    if (seen.has(u)) continue;
    seen.add(u);
    projects.push({ t: name, u: u, g: group });
  }
});

projects.sort((a, b) => a.g.localeCompare(b.g) || a.t.localeCompare(b.t));

/* pretty-print one object per line so diffs stay readable */
const body = projects.map((p) => '    ' + JSON.stringify(p)).join(',\n');
const block = '  /* PROJECTS:START */\n  var PROJECTS = [\n' + body + '\n  ];\n  /* PROJECTS:END */';

const marker = / {2}\/\* PROJECTS:START \*\/[\s\S]*? {2}\/\* PROJECTS:END \*\//;
if (!marker.test(sitejs)) { console.error('Could not find PROJECTS markers in site.js'); process.exit(1); }
const replaced = sitejs.replace(marker, block);
fs.writeFileSync(sitejsPath, replaced);
console.log((replaced === sitejs ? 'Up to date: ' : 'Wrote ') + projects.length + ' projects from ' + files.length + ' files into site.js');
