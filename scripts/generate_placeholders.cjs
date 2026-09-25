/**
 * Asset Placeholder Generator Script
 * Menghasilkan placeholder berlabel dengan Asset Key untuk seluruh entitas grafis dan audio (D2, D11).
 */
const fs = require('fs');
const path = require('path');

const targetDir = path.resolve(__dirname, '../public/assets/placeholders');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 1. Placeholder SVG Vektor Berlabel
function createSvgPlaceholder(key, width, height, color, label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${color}" stroke="#2C3E50" stroke-width="2"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2C3E50">${label} [${key}]</text>
</svg>`;
}

const svgAssets = [
  { key: 'avatar_base_head', width: 120, height: 120, color: '#F1C27D', label: 'HEAD' },
  { key: 'avatar_hair_set', width: 120, height: 120, color: '#8D5524', label: 'HAIR' },
  { key: 'avatar_eyes_set', width: 40, height: 20, color: '#3498DB', label: 'EYES' },
  { key: 'avatar_brows_set', width: 40, height: 10, color: '#2C3E50', label: 'BROWS' },
  { key: 'ui_icon_pack', width: 24, height: 24, color: '#E2E8F0', label: 'ICON' },
];

svgAssets.forEach(item => {
  const content = createSvgPlaceholder(item.key, item.width, item.height, item.color, item.label);
  fs.writeFileSync(path.join(targetDir, `${item.key}.svg`), content, 'utf8');
});

// 2. Placeholder Audio Berlabel (Minimal Valid Silent 44-byte WAV)
// RIFF header untuk file audio WAV 8kHz mono silent 0.1s
function createSilentWavBuffer() {
  const buffer = Buffer.alloc(44);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36, 4); // chunkSize
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20);  // audioFormat (1 for PCM)
  buffer.writeUInt16LE(1, 22);  // numChannels (1 for Mono)
  buffer.writeUInt32LE(8000, 24); // sampleRate
  buffer.writeUInt32LE(8000, 28); // byteRate
  buffer.writeUInt16LE(1, 32);  // blockAlign
  buffer.writeUInt16LE(8, 34);  // bitsPerSample
  buffer.write('data', 36);
  buffer.writeUInt32LE(0, 40);  // subchunk2Size
  return buffer;
}

const audioKeys = [
  'sfx_ui_click',
  'sfx_age_tick',
  'sfx_birth',
  'sfx_death',
  'sfx_cash',
  'sfx_fail',
];

const silentWav = createSilentWavBuffer();
audioKeys.forEach(key => {
  fs.writeFileSync(path.join(targetDir, `${key}.wav`), silentWav);
});

console.log(`[GENERATOR PASS] Dihasilkan ${svgAssets.length + audioKeys.length} placeholder aset di ${targetDir}`);
const generatedFiles = fs.readdirSync(targetDir);
generatedFiles.forEach(file => console.log(` - ${file}`));
