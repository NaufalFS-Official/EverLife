import React from 'react';
import { useGame } from '../../engine/GameContext';
import { INITIAL_JOB_LISTINGS } from '../../core/career';
import { GraduationCap } from 'lucide-react';

export const OccupationTab: React.FC = () => {
  const { state, applyJob, quitJob, workHard } = useGame();
  if (!state) return null;
  const { character } = state;

  return (
    <div className="space-y-4">
      {/* Education Box */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
            <GraduationCap size={15} className="text-blue-500" /> Jenjang Pendidikan
          </span>
          <span className="text-xs font-bold text-slate-900 bg-blue-100 px-2.5 py-0.5 rounded-full">
            {character.education.level === 'None' ? 'Belum Sekolah' : character.education.level}
          </span>
        </div>
      </div>

      {/* Current Job Box */}
      <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-800">Pekerjaan Aktif</span>
          {character.job && (
            <span className="text-xs font-bold text-emerald-700 font-mono">
              ${character.job.salary.toLocaleString()}/tahun
            </span>
          )}
        </div>
        {character.job ? (
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">{character.job.title}</h4>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-600">
                <span>Performa Kerja</span>
                <span className="font-bold">{character.job.performance}%</span>
              </div>
              <div className="w-full h-1.5 bg-emerald-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full"
                  style={{ width: `${character.job.performance}%` }}
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={workHard}
                className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-500 transition cursor-pointer"
              >
                Bekerja Keras
              </button>
              <button
                onClick={quitJob}
                className="py-2 px-4 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-rose-100 hover:text-rose-700 transition cursor-pointer"
              >
                Undurkan Diri
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-600 italic">
            {character.age < 18 ? 'Anda masih dalam usia sekolah.' : 'Saat ini Anda berstatus pengangguran.'}
          </p>
        )}
      </div>

      {/* Available Job Listings */}
      {character.age >= 18 && !character.job && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Lowongan Pekerjaan Tersedia
          </h4>
          <div className="space-y-2">
            {INITIAL_JOB_LISTINGS.map((job) => (
              <div
                key={job.id}
                className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between hover:border-slate-300 transition"
              >
                <div>
                  <p className="font-bold text-xs text-slate-900">{job.title}</p>
                  <p className="text-[10px] text-slate-600">
                    Min: {job.minEducation} • Smarts: {job.minSmarts}%
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-700">
                    ${job.baseSalary.toLocaleString()}
                  </span>
                  <button
                    onClick={() => applyJob(job)}
                    className="px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-lg hover:bg-emerald-600 transition cursor-pointer"
                  >
                    Lamar
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
