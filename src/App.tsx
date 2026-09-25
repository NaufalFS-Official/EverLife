import React from 'react';

export const App: React.FC = () => {
  return (
    <main
      id="app-root"
      className="w-full max-w-[430px] h-[100dvh] bg-slate-50 relative shadow-2xl flex flex-col justify-between overflow-hidden border-x border-slate-200"
    >
      <header className="bg-red-600 text-white p-4 shadow flex justify-between items-center">
        <h1 className="font-bold text-lg tracking-wide">EverLife</h1>
        <span className="text-xs bg-red-700 px-2 py-1 rounded font-mono">v1.0.0</span>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 rounded-full bg-slate-200 border-2 border-dashed border-slate-400 flex items-center justify-center mb-4">
          <span className="text-xs font-semibold text-slate-500">AVATAR</span>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Kanvas Kosong Inisial</h2>
        <p className="text-sm text-slate-600 max-w-xs">
          Simulator Kehidupan EverLife berhasil diinisialisasi. Menunggu eksekusi Sesi 1 (Alpha Core Loop).
        </p>
      </section>

      <footer className="p-4 bg-white border-t border-slate-200 flex justify-around text-xs text-slate-500 font-medium">
        <span>Setup Complete</span>
        <span>Mode A (C0)</span>
      </footer>
    </main>
  );
};

export default App;
