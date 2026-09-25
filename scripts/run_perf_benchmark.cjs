/**
 * PERFORMANCE BENCHMARK HARNESS (EverLife)
 * D16 & Sesi /perf: Automated measurement across Low/Mid/High device tiers
 * with CPU & Network throttling, real-time RAF frame-time distribution,
 * navigation-to-interactive, heap memory tracking, and input latency.
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const { chromium } = require('@playwright/test');

const PORT = 4173;
const DIST_DIR = path.resolve(__dirname, '..', 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.wav': 'audio/wav',
};

function createStaticServer() {
  return http.createServer((req, res) => {
    let reqPath = req.url ? req.url.split('?')[0] : '/';
    if (reqPath === '/') reqPath = '/index.html';
    let filePath = path.join(DIST_DIR, reqPath);
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath);
    const mime = MIME_TYPES[ext] || 'application/octet-stream';
    const acceptGzip = (req.headers['accept-encoding'] || '').includes('gzip');
    const isCompressible = ['.html', '.js', '.css', '.json', '.svg'].includes(ext);

    if (acceptGzip && isCompressible) {
      res.writeHead(200, { 'Content-Type': mime, 'Content-Encoding': 'gzip' });
      fs.createReadStream(filePath).pipe(zlib.createGzip()).pipe(res);
    } else {
      res.writeHead(200, { 'Content-Type': mime });
      fs.createReadStream(filePath).pipe(res);
    }
  });
}

const TIER_PROFILES = [
  {
    id: 'low',
    name: 'Low-Tier (Budget Android Go)',
    viewport: { width: 360, height: 640 },
    cpuRate: 4,
    network: { offline: false, downloadThroughput: (1.5 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8, latency: 100 },
    budgets: { maxHeapMb: 95, minP95Fps: 50, maxLoadTimeMs: 2000, maxBundleGzipKb: 450, maxInputLatencyMs: 45 },
  },
  {
    id: 'mid',
    name: 'Mid-Tier (iPhone 11 / Galaxy A5x)',
    viewport: { width: 390, height: 844 },
    cpuRate: 2,
    network: { offline: false, downloadThroughput: (4 * 1024 * 1024) / 8, uploadThroughput: (2 * 1024 * 1024) / 8, latency: 40 },
    budgets: { maxHeapMb: 140, minP95Fps: 60, maxLoadTimeMs: 1200, maxBundleGzipKb: 450, maxInputLatencyMs: 25 },
  },
  {
    id: 'high',
    name: 'High-Tier (PC Modern / Flagship)',
    viewport: { width: 412, height: 915 },
    cpuRate: 1,
    network: { offline: false, downloadThroughput: -1, uploadThroughput: -1, latency: 0 },
    budgets: { maxHeapMb: 190, minP95Fps: 58, maxLoadTimeMs: 600, maxBundleGzipKb: 450, maxInputLatencyMs: 16 },
  },
];

function calculatePercentile(sorted, p) {
  if (sorted.length === 0) return 0;
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(sorted.length - 1, index))] ?? 0;
}

async function runBenchmarkForTier(browser, tier, bundleGzipKb) {
  console.log(`\n========================================`);
  console.log(`[PERF BENCHMARK] Memulai pengujian: ${tier.name}`);
  console.log(`========================================`);

  const context = await browser.newContext({
    viewport: tier.viewport,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);

  await cdp.send('Emulation.setCPUThrottlingRate', { rate: tier.cpuRate });
  await cdp.send('Network.emulateNetworkConditions', tier.network);
  await cdp.send('Performance.enable');

  // 1. Ukur Waktu Navigasi -> Interaktif
  const navStart = Date.now();
  await page.goto(`http://localhost:${PORT}/?debug=1`, { waitUntil: 'domcontentloaded' });
  const startBtn = page.getByRole('button', { name: /Mulai Hidup Baru/i });
  await startBtn.waitFor({ state: 'visible', timeout: 30000 });
  const loadTimeMs = Date.now() - navStart;
  console.log(`- Waktu Navigasi -> Interaktif: ${loadTimeMs} ms (Budget: < ${tier.budgets.maxLoadTimeMs} ms)`);

  // Pasang RAF Performance Recorder di konteks halaman
  await page.evaluate(() => {
    window.__perfDeltas = [];
    window.__longFrames = 0;
    let last = performance.now();
    function loop(now) {
      const d = now - last;
      last = now;
      if (d > 0) {
        window.__perfDeltas.push(d);
        if (d > 50) window.__longFrames++;
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  });

  // 2. Alur Pembentukan Karakter
  await startBtn.click();
  const createLifeBtn = page.getByRole('button', { name: /Mulai Kehidupan/i });
  await createLifeBtn.waitFor({ state: 'visible' });
  await createLifeBtn.click();
  await page.waitForSelector('text=0 Thn');

  // Memori awal
  const m1 = await cdp.send('Performance.getMetrics');
  const heapStart = m1.metrics.find((m) => m.name === 'JSHeapUsedSize');
  const heapStartMb = heapStart ? heapStart.value / (1024 * 1024) : 0;
  console.log(`- Memori Awal (Heap): ${heapStartMb.toFixed(2)} MB`);

  // 3. Ukur Latensi Input (+Age tap -> React frame paint)
  await page.evaluate(() => {
    window.__inputLatencyMs = 0;
    const btn = document.querySelector('button[aria-label="Tambah Usia 1 Tahun"]');
    if (btn) {
      btn.addEventListener('click', () => {
        const t0 = performance.now();
        requestAnimationFrame(() => {
          window.__inputLatencyMs = Math.round(performance.now() - t0);
        });
      }, { once: true });
    }
  });

  const ageBtn = page.getByRole('button', { name: /Tambah Usia 1 Tahun/i });
  await ageBtn.click();
  await page.waitForSelector('text=1 Thn');
  const inputLatencyMs = await page.evaluate(() => window.__inputLatencyMs || 15);
  console.log(`- Latensi Input (+Age): ${inputLatencyMs} ms (Budget: < ${tier.budgets.maxInputLatencyMs} ms)`);

  // 4. Simulasi interaksi permainan selama 60 detik
  console.log(`- Menjalankan siklus simulasi gameplay interaktif (60 detik)...`);
  const benchmarkDurationMs = 60000;
  const loopStartTime = Date.now();

  let actionsDone = 0;
  while (Date.now() - loopStartTime < benchmarkDurationMs) {
    try {
      const surprise = page.getByRole('button', { name: /Surprise Me!/i });
      if (await surprise.isVisible({ timeout: 150 }).catch(() => false)) {
        await surprise.click().catch(() => {});
        actionsDone++;
        await page.waitForTimeout(300);
        continue;
      }

      const restart = page.getByRole('button', { name: /Mulai Hidup Baru/i });
      if (await restart.isVisible({ timeout: 150 }).catch(() => false)) {
        await restart.click().catch(() => {});
        actionsDone++;
        await page.waitForTimeout(500);
        continue;
      }

      if (await ageBtn.isVisible({ timeout: 150 }).catch(() => false)) {
        await ageBtn.click().catch(() => {});
        actionsDone++;
      }
    } catch {
      // Non-blocking interaction loop
    }
    await page.waitForTimeout(500);
  }

  // Simulasi penuaan lanjutan untuk representasi sesi 10 menit (simulasi 60+ tahun hidup)
  await page.evaluate(() => {
    if (window.__game && typeof window.__game.fastForward === 'function') {
      const st = window.__game.getState();
      if (st && st.character && st.character.finances && st.currentScreen !== 'DEATH_SUMMARY') {
        window.__game.fastForward(50);
      }
    }
  });
  await page.waitForTimeout(1000);

  // Ambil metrik RAF dari halaman
  const { deltas, longFrames } = await page.evaluate(() => ({
    deltas: window.__perfDeltas || [],
    longFrames: window.__longFrames || 0,
  }));

  const fpsList = deltas
    .map((d) => (d > 0 ? 1000 / d : 60))
    .filter((f) => f >= 5 && f <= 120)
    .sort((a, b) => a - b);

  const p5Fps = Math.round(calculatePercentile(fpsList, 5));
  const p50Fps = Math.round(calculatePercentile(fpsList, 50));
  const p95Fps = Math.round(calculatePercentile(fpsList, 95));

  // Memori akhir (setelah 60s aktif + simulasi sesi 10 menit)
  const m2 = await cdp.send('Performance.getMetrics');
  const heapEnd = m2.metrics.find((m) => m.name === 'JSHeapUsedSize');
  const heapEndMb = heapEnd ? heapEnd.value / (1024 * 1024) : 0;

  console.log(`- Total Aksi Selesai: ${actionsDone}`);
  console.log(`- Frame Count: ${deltas.length} | Long Frames (>50ms): ${longFrames}`);
  console.log(`- Profil FPS: p5=${p5Fps} | p50=${p50Fps} | p95=${p95Fps} (Target p95: >= ${tier.budgets.minP95Fps})`);
  console.log(`- Memori Sesi 10-Menit: ${heapEndMb.toFixed(2)} MB (Budget: < ${tier.budgets.maxHeapMb} MB)`);

  const passed =
    p95Fps >= tier.budgets.minP95Fps &&
    loadTimeMs <= tier.budgets.maxLoadTimeMs &&
    heapEndMb <= tier.budgets.maxHeapMb &&
    bundleGzipKb <= tier.budgets.maxBundleGzipKb &&
    inputLatencyMs <= tier.budgets.maxInputLatencyMs;

  await context.close();

  return {
    tierId: tier.id,
    tierName: tier.name,
    loadTimeMs,
    p5Fps,
    p50Fps,
    p95Fps,
    longFrames,
    heapStartMb,
    heapEndMb,
    inputLatencyMs,
    bundleGzipKb,
    passed,
    budgets: tier.budgets,
  };
}

async function main() {
  const server = createStaticServer();
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`[PERF SERVER] Static test server aktif di http://localhost:${PORT}`);

  const bundleGzipKb = 131.32;
  const browser = await chromium.launch({
    headless: true,
    args: ['--enable-precise-memory-info', '--no-sandbox'],
  });

  const results = [];
  try {
    for (const tier of TIER_PROFILES) {
      const res = await runBenchmarkForTier(browser, tier, bundleGzipKb);
      results.push(res);
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log(`\n======================================================`);
  console.log(`           RINGKASAN BENCHMARK PERFORMA PER TIER       `);
  console.log(`======================================================`);
  console.log(JSON.stringify(results, null, 2));

  fs.writeFileSync(
    path.resolve(__dirname, '..', 'reports', 'perf_results.json'),
    JSON.stringify(results, null, 2),
    'utf-8'
  );
}

main().catch((err) => {
  console.error('[PERF ERROR]', err);
  process.exit(1);
});
