/**
 * Baseline Secret Detector Script
 * Memindai repositori untuk mencegah kebocoran private key, token rahasia, atau kredensial.
 */
const fs = require('fs');
const path = require('path');

const SECRET_PATTERNS = [
  /-----BEGIN [A-Z]+ PRIVATE KEY-----/,
  /AIza[0-9A-Za-z-_]{35}/, // Google API Key
  /sk-[a-zA-Z0-9]{32,}/,   // OpenAI Secret Key
  /(password|passwd|secret|api_key|apikey)\s*[:=]\s*['"][^\s'"]{8,}['"]/i,
];

const IGNORE_DIRS = ['node_modules', '.git', 'dist', 'coverage', '.system_generated', 'brain'];

function scanDir(dir) {
  let findings = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (IGNORE_DIRS.includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      findings = findings.concat(scanDir(fullPath));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.env', '.html'].includes(ext) || entry.name.startsWith('.env')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        for (const pattern of SECRET_PATTERNS) {
          if (pattern.test(content)) {
            findings.push({ file: fullPath, pattern: pattern.toString() });
          }
        }
      }
    }
  }

  return findings;
}

const rootDir = path.resolve(__dirname, '..');
const results = scanDir(rootDir);

if (results.length > 0) {
  console.error('[SECURITY ERROR] Ditemukan potensi secret/token rahasia yang bocor:');
  results.forEach(r => console.error(` - ${r.file}: pola ${r.pattern}`));
  process.exit(1);
} else {
  console.log('[SECURITY PASS] Pindai rahasia bersih: 0 temuan secret di repositori.');
  process.exit(0);
}
