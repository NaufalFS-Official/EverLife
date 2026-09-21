import React from 'react';

export const App: React.FC = () => {
  return (
    <main className="w-full max-w-[390px] min-h-screen bg-white shadow-xl flex flex-col justify-between border-x border-slate-200">
      <header className="pt-12 pb-4 px-4 bg-[#0A2540] text-white flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">EverLife</h1>
        <span className="text-xs bg-[#1A73E8] px-2 py-0.5 rounded-full font-medium">v1.0-SMA</span>
      </header>

      <section className="flex-1 p-6 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-[#1A73E8]/10 text-[#1A73E8] flex items-center justify-center text-2xl font-bold mb-4">
          EL
        </div>
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Kanvas Lingkungan Aktif</h2>
        <p className="text-sm text-slate-500 max-w-[260px]">
          Fondasi sistem EverLife telah terpasang. Menunggu inisialisasi kontrak data pada SESI-02.
        </p>
      </section>

      <footer className="p-4 border-t border-slate-100 text-center text-xs text-slate-400">
        Viewport Target: 390 × 844 pt (Fixed UI)
      </footer>
    </main>
  );
};

export default App;
