/**
 * BUNDLE SIZE VERIFIER & QUALITY GATE (EverLife)
 * Blueprint S1 & PRD §12.1: Enforces dist/ bundle budget (< 450 kB total gzipped).
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const MAX_TOTAL_GZIP_KB = 450;
const distDir = path.join(__dirname, '..', 'dist');

if (!fs.existsSync(distDir)) {
  console.error('[BUNDLE GATE ERROR] Direktori dist/ tidak ditemukan. Jalankan `npm run build` terlebih dahulu.');
  process.exit(1);
}

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  });
  return results;
}

const allFiles = getFiles(distDir);
let totalSizeBytes = 0;
let totalGzipBytes = 0;

console.log('=== EVERLIFE BUNDLE SIZE REPORT ===');
allFiles.forEach((file) => {
  const content = fs.readFileSync(file);
  const size = content.length;
  const gzipped = zlib.gzipSync(content).length;

  totalSizeBytes += size;
  totalGzipBytes += gzipped;

  const rel = path.relative(distDir, file).replace(/\\/g, '/');
  console.log(`- ${rel.padEnd(35)} ${(size / 1024).toFixed(2).padStart(8)} kB (gzip: ${(gzipped / 1024).toFixed(2).padStart(6)} kB)`);
});

const totalGzipKb = totalGzipBytes / 1024;
console.log('-----------------------------------');
console.log(`TOTAL RAW SIZE  : ${(totalSizeBytes / 1024).toFixed(2)} kB`);
console.log(`TOTAL GZIP SIZE : ${totalGzipKb.toFixed(2)} kB`);
console.log(`MAX BUDGET      : ${MAX_TOTAL_GZIP_KB} kB`);

if (totalGzipKb > MAX_TOTAL_GZIP_KB) {
  console.error(`\n[BUNDLE GATE FAILED] Ukuran bundle (${totalGzipKb.toFixed(2)} kB gzip) melampaui batas anggaran ${MAX_TOTAL_GZIP_KB} kB!`);
  process.exit(1);
}

console.log('\n[BUNDLE GATE PASS] Ukuran bundle memenuhi standar efisiensi perangkat seluler.\n');
process.exit(0);
