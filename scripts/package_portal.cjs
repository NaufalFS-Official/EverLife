const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const zipPath = path.join(rootDir, 'everlife-web-portal.zip');

if (!fs.existsSync(distDir)) {
  console.error('[PORTAL ERROR] dist directory does not exist. Run npm run build first.');
  process.exit(1);
}

if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

try {
  if (process.platform === 'win32') {
    execSync('powershell -Command "Compress-Archive -Path dist/* -DestinationPath everlife-web-portal.zip -Force"', { stdio: 'inherit' });
  } else {
    execSync('cd dist && zip -r -q ../everlife-web-portal.zip .', { stdio: 'inherit' });
  }
  console.log('[PORTAL READY] everlife-web-portal.zip siap diunggah ke Web Game Portal.');
} catch (err) {
  try {
    execSync('python3 -c "import shutil; shutil.make_archive(\'everlife-web-portal\', \'zip\', \'dist\')"', { stdio: 'inherit' });
    console.log('[PORTAL READY] everlife-web-portal.zip siap diunggah ke Web Game Portal (via python3).');
  } catch (pyErr) {
    console.error('[PORTAL ERROR] Failed to create zip archive:', err);
    process.exit(1);
  }
}
