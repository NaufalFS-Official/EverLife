import { test, expect } from '@playwright/test';

test.describe('E2E FTUE: First 60 Seconds End-to-End Gameplay Flow (Blueprint S4.3)', () => {
  test('harus menyelesaikan alur FTUE dari menu, New Life, penuaan, event modal, hingga relasi', async ({ page }) => {
    await page.goto('/');

    // 1. Menu Utama -> Mulai Hidup Baru
    const startNewLifeBtn = page.getByRole('button', { name: /Mulai Hidup Baru/i });
    await expect(startNewLifeBtn).toBeVisible();
    await startNewLifeBtn.click();

    // 2. Wizard Karakter Baru
    await expect(page.getByText('Karakter Baru')).toBeVisible();
    const startLifeBtn = page.getByRole('button', { name: /Mulai Kehidupan/i });
    await expect(startLifeBtn).toBeVisible();
    await startLifeBtn.click();

    // 3. Masuk Dashboard Usia 0
    await expect(page.getByText('0 Thn')).toBeVisible();
    await expect(page.getByText(/Saya lahir di/i)).toBeVisible();

    // 4. Tekan tombol +AGE (Usia 1)
    const ageFab = page.getByRole('button', { name: /Tambah Usia 1 Tahun/i });
    await expect(ageFab).toBeVisible();
    await ageFab.click();
    await expect(page.getByText('1 Thn')).toBeVisible();

    // Selesaikan skenario naratif jika muncul sebelum membuka drawer
    const surpriseBtn = page.getByRole('button', { name: /Surprise Me!/i });
    if (await surpriseBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await surpriseBtn.click();
    }

    // 5. Buka Menu Relasi
    const relasiTab = page.getByRole('button', { name: /Relasi/i });
    await relasiTab.click();
    await expect(page.getByText('Keluarga & Relasi')).toBeVisible();
    await expect(page.getByText(/Father/i).first()).toBeVisible();

    // 6. Tutup Drawer Relasi
    const closeBtn = page.getByRole('button', { name: /Tutup menu/i });
    await closeBtn.click();
    await expect(page.getByText('Keluarga & Relasi')).not.toBeVisible();
  });
});
