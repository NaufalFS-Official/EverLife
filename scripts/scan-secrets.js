import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const patterns = [
  { name: 'Private Key', regex: /-----BEGIN [A-Z]+ PRIVATE KEY-----/ },
  { name: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/ },
  { name: 'Generic API Key / Secret', regex: /(?:api_key|apiKey|secret|password|auth_token)\s*[:=]\s*['"][A-Za-z0-9_\-]{16,}['"]/i },
  { name: 'Slack Token', regex: /xox[baprs]-[0-9a-zA-Z]{10,48}/ },
];

const ignoredDirs = new Set(['node_modules', '.git', 'dist', '.gemini']);
let findings = 0;

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (ignoredDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.isFile()) {
      if (entry.name === 'package-lock.json' || entry.name === '.secrets.baseline') continue;
      const content = fs.readFileSync(fullPath, 'utf-8');
      for (const pattern of patterns) {
        if (pattern.regex.test(content)) {
          console.error(`[SEKRET TERDETEKSI] ${pattern.name} ditemukan di: ${path.relative(rootDir, fullPath)}`);
          findings++;
        }
      }
    }
  }
}

console.log('Memulai pemindaian rahasia di direktori proyek...');
scanDir(rootDir);

if (findings === 0) {
  console.log('HASIL PINDAI RAHASIA: BERSIH. 0 rahasia terdeteksi.');
  process.exit(0);
} else {
  console.error(`HASIL PINDAI RAHASIA: GAGAL. ${findings} potensi rahasia ditemukan.`);
  process.exit(1);
}
