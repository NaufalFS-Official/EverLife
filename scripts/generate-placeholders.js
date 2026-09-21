import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.resolve(__dirname, '../public/placeholders');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const assets = [
  { name: 'icon-heart', width: 64, height: 64, bg: '#2ECC71', label: 'HEART' },
  { name: 'icon-smile', width: 64, height: 64, bg: '#F1C40F', label: 'SMILE' },
  { name: 'icon-users', width: 64, height: 64, bg: '#E91E63', label: 'USERS' },
  { name: 'icon-book', width: 64, height: 64, bg: '#2980B9', label: 'BOOK' },
  { name: 'icon-coins', width: 64, height: 64, bg: '#E67E22', label: 'COINS' },
  { name: 'icon-calendar', width: 64, height: 64, bg: '#8E44AD', label: 'AGE_UP' },
  { name: 'icon-settings', width: 64, height: 64, bg: '#64748B', label: 'SETTING' },
  { name: 'avatar-placeholder', width: 128, height: 128, bg: '#CBD5E1', label: 'AVATAR' },
];

console.log('Memulai pembuatan placeholder aset berlabel...');

const generatedFiles = [];

for (const asset of assets) {
  const filePath = path.join(outputDir, `${asset.name}.svg`);
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${asset.width} ${asset.height}" width="${asset.width}" height="${asset.height}">
  <rect width="${asset.width}" height="${asset.height}" rx="8" fill="${asset.bg}" stroke="#1E293B" stroke-width="2"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="${Math.max(10, Math.floor(asset.width / 5))}" font-weight="bold" fill="#1E293B">${asset.label}</text>
</svg>`;

  fs.writeFileSync(filePath, svgContent, 'utf-8');
  generatedFiles.push(`${asset.name}.svg (${asset.width}x${asset.height}, ${asset.bg})`);
}

console.log(`Berhasil membuat ${generatedFiles.length} file placeholder di ${outputDir}:`);
for (const file of generatedFiles) {
  console.log(` - ${file}`);
}
