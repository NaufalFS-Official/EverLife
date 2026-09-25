import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('PWA Manifest & Service Worker Integrity', () => {
  const rootDir = process.cwd();
  const manifestPath = path.join(rootDir, 'public', 'manifest.webmanifest');
  const swPath = path.join(rootDir, 'public', 'sw.js');
  const icon192Path = path.join(rootDir, 'public', 'icons', 'icon-192.svg');
  const icon512Path = path.join(rootDir, 'public', 'icons', 'icon-512.svg');

  it('harus memiliki manifest.webmanifest dengan konfigurasi valid', () => {
    expect(fs.existsSync(manifestPath)).toBe(true);

    const raw = fs.readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(raw);

    expect(manifest.name).toBe('EverLife - Life Simulator Sandbox');
    expect(manifest.short_name).toBe('EverLife');
    expect(manifest.display).toBe('standalone');
    expect(manifest.orientation).toBe('portrait');
    expect(manifest.start_url).toBe('/');
    expect(manifest.background_color).toBe('#0f172a');
    expect(manifest.theme_color).toBe('#059669');

    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);

    const has192 = manifest.icons.some((i: { sizes: string }) => i.sizes === '192x192');
    const has512 = manifest.icons.some((i: { sizes: string }) => i.sizes === '512x512');
    expect(has192).toBe(true);
    expect(has512).toBe(true);
  });

  it('harus memiliki berkas ikon PWA 192px dan 512px yang valid', () => {
    expect(fs.existsSync(icon192Path)).toBe(true);
    expect(fs.existsSync(icon512Path)).toBe(true);

    const svg192 = fs.readFileSync(icon192Path, 'utf-8');
    expect(svg192).toContain('<svg');
    expect(svg192).toContain('192');

    const svg512 = fs.readFileSync(icon512Path, 'utf-8');
    expect(svg512).toContain('<svg');
    expect(svg512).toContain('512');
  });

  it('harus memiliki Service Worker sw.js dengan strategi cache ber-versi', () => {
    expect(fs.existsSync(swPath)).toBe(true);

    const swContent = fs.readFileSync(swPath, 'utf-8');
    expect(swContent).toContain("CACHE_NAME = 'everlife-v1.0.0'");
    expect(swContent).toContain("addEventListener('install'");
    expect(swContent).toContain("addEventListener('activate'");
    expect(swContent).toContain("addEventListener('fetch'");
    expect(swContent).toContain('/manifest.webmanifest');
  });
});
