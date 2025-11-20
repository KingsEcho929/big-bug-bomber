#!/usr/bin/env node

/**
 * BIG_BUG_BOMBER — Leak-prevention daemon
 * Crowns backend truth by detonating open-ended fragments before they leak.
 * Guardian of entrusted data, loop-closer, async-sealer, daemon terminator.
 */

const fs = require('fs');
const { execSync } = require('child_process');

const LOG_PATH = './detonation.log';
const MAX_DEPTH = 10;

function logDetonation(reason, file, line) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] Detonated: ${reason} in ${file}:${line}\n`;
  fs.appendFileSync(LOG_PATH, entry);
  console.warn(entry);
}

function detectUnclosedAsync(code) {
  const asyncWithoutAwait = /async\s+function\s+\w+\s*\([^)]*\)\s*{[^}]*[^await][^}]*}/g;
  return asyncWithoutAwait.test(code);
}

function detectUnclearedIntervals(code) {
  const intervalSet = /setInterval\(/g;
  const intervalClear = /clearInterval\(/g;
  return intervalSet.test(code) && !intervalClear.test(code);
}

function detectUntrappedShell(code) {
  const backgrounded = /&\s*$/gm;
  const hasTrap = /trap\s+['"][^'"]+['"]\s+(INT|TERM)/g;
  return backgrounded.test(code) && !hasTrap.test(code);
}

function scanFile(path) {
  const code = fs.readFileSync(path, 'utf8');
  if (detectUnclosedAsync(code)) logDetonation('Unclosed async function', path, 0);
  if (detectUnclearedIntervals(code)) logDetonation('Uncleared interval', path, 0);
  if (detectUntrappedShell(code)) logDetonation('Untrapped background shell', path, 0);
}

function scanDirectory(dir = './') {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = `${dir}/${file}`;
    if (fs.statSync(fullPath).isDirectory()) {
      if (dir.split('/').length < MAX_DEPTH) scanDirectory(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.sh') || file.endsWith('.yml')) {
      scanFile(fullPath);
    }
  }
}

console.log('🧨 BIG_BUG_BOMBER activated. Scanning for backend leaks...');
scanDirectory();
console.log('✅ Scan complete. Detonations logged in detonation.log');
