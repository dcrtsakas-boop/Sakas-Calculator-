
import React from 'react';
import { NutritionInfo } from '../types';

interface NutrientDisplayProps {
  data: NutritionInfo;
}

const NutrientDisplay: React.FC<NutrientDisplayProps> = ({ data }) => {
  return (
    <div className="bg-green-950/10 border border-[#22C55E] rounded-3xl p-6 space-y-6 shadow-[0_0_40px_rgba(34,197,94,0.15)] animate-slideIn">
      <div className="border-b border-green-900 pb-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-2xl font-black text-white uppercase tracking-tight">{data.foodName}</h3>
          <span className="bg-[#22C55E] text-black px-2 py-0.5 rounded text-[10px] font-bold">
            CONFIANCE IA : {(data.confidence * 100).toFixed(0)}%
          </span>
        </div>
        <p className="text-green-700 text-xs font-mono italic leading-relaxed">
          {data.description}
        </p>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-black text-white tracking-tighter">{data.calories}</span>
        <span className="text-[#22C55E] font-mono text-sm uppercase">kcal totales</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Protein */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-xs font-mono text-green-700 uppercase">Protéines</span>
            <span className="text-xl font-bold text-white">{data.proteins}g</span>
          </div>
          <div className="h-2 w-full bg-green-950 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#22C55E] shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all duration-1000" 
              style={{ width: `${Math.min((data.proteins / 50) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Carbs */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-xs font-mono text-green-700 uppercase">Glucides</span>
            <span className="text-xl font-bold text-white">{data.carbs}g</span>
          </div>
          <div className="h-2 w-full bg-green-950 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-600 shadow-[0_0_10px_rgba(22,163,74,0.5)] transition-all duration-1000" 
              style={{ width: `${Math.min((data.carbs / 100) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Fats */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-xs font-mono text-green-700 uppercase">Lipides</span>
            <span className="text-xl font-bold text-white">{data.fats}g</span>
          </div>
          <div className="h-2 w-full bg-green-950 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-800 shadow-[0_0_10px_rgba(20,83,45,0.5)] transition-all duration-1000" 
              style={{ width: `${Math.min((data.fats / 40) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-green-900/50">
        <p className="text-[10px] text-green-800 font-mono text-center uppercase tracking-widest">
          Données estimées par l'IA Gemini Vision • Vérifiez toujours les portions réelles
        </p>
      </div>
    </div>
  );
};

export default NutrientDisplay;
