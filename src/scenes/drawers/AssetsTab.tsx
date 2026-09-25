import React from 'react';
import { useGame } from '../../engine/GameContext';
import rawAssets from '../../data/assets.json';

interface AssetDef {
  id: string;
  name: string;
  category: 'Vehicle' | 'RealEstate';
  value: number;
  maintenanceAnnual: number;
}

const ASSET_CATALOGUE: AssetDef[] = rawAssets as AssetDef[];

export const AssetsTab: React.FC = () => {
  const { state, buyAsset, sellOwnedAsset } = useGame();
  if (!state) return null;
  const { character } = state;

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-1">
        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total Kekayaan Bersih</span>
        <p className="text-2xl font-black font-mono text-emerald-400">
          ${character.finances.netWorth.toLocaleString()}
        </p>
        <div className="flex justify-between text-xs text-slate-300 pt-1 border-t border-slate-800">
          <span>Saldo Tunai:</span>
          <span className="font-bold text-white">${character.finances.bankBalance.toLocaleString()}</span>
        </div>
      </div>

      {/* Owned Assets */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Aset yang Dimiliki</h4>
        {character.assets && character.assets.length > 0 ? (
          <div className="space-y-2">
            {character.assets.map((asset) => (
              <div
                key={asset.id}
                className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-xs text-slate-900">{asset.name}</p>
                  <p className="text-[10px] text-slate-600">
                    Nilai: ${asset.value.toLocaleString()} • Rawat: ${asset.maintenanceAnnual}/thn
                  </p>
                </div>
                <button
                  onClick={() => sellOwnedAsset(asset.id)}
                  className="min-h-[44px] min-w-[56px] px-3.5 py-2 bg-rose-100 text-rose-700 text-xs font-bold rounded-xl hover:bg-rose-200 transition cursor-pointer flex items-center justify-center"
                >
                  Jual
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-600 italic">Anda belum memiliki kendaraan atau properti pribadi.</p>
        )}
      </div>

      {/* Asset Market */}
      {character.age >= 18 && (
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Pasar Properti & Kendaraan</h4>
          <div className="space-y-2">
            {ASSET_CATALOGUE.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-xs text-slate-900">{item.name}</p>
                  <p className="text-[10px] text-slate-600">
                    {item.category === 'Vehicle' ? 'Kendaraan' : 'Properti'} • Rawat: ${item.maintenanceAnnual}/thn
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900">
                    ${item.value.toLocaleString()}
                  </span>
                  <button
                    onClick={() => buyAsset(item)}
                    className="min-h-[44px] min-w-[56px] px-3.5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-500 transition cursor-pointer flex items-center justify-center"
                  >
                    Beli
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
