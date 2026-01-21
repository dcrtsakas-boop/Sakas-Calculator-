
import React, { useState, useMemo } from 'react';
import { UserStats, DailyNeeds, HistoryItem } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const DailyCalculator: React.FC = () => {
  const [stats, setStats] = useState<UserStats>({
    weight: 75,
    height: 175,
    age: 25,
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintain',
  });
  const [saved, setSaved] = useState(false);

  const needs = useMemo<DailyNeeds>(() => {
    setSaved(false);
    // Étape 1 — Métabolisme de base (BMR) - Mifflin-St Jeor
    let bmr = (10 * stats.weight) + (6.25 * stats.height) - (5 * stats.age);
    bmr = stats.gender === 'male' ? bmr + 5 : bmr - 161;

    // Étape 2 — Calories journalières (TDEE)
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      extra: 1.9,
    };

    let tdee = bmr * activityMultipliers[stats.activityLevel];

    // Objectif selon ton but
    if (stats.goal === 'lose') tdee -= 400; // Sèche
    if (stats.goal === 'gain') tdee += 400; // Prise de masse

    // Macronutriments
    let proteinCoeff = 1.6;
    let carbCoeff = 4;
    let fatCoeff = 0.9;

    if (stats.goal === 'lose') {
      proteinCoeff = 2.4;
      carbCoeff = 2.5;
      fatCoeff = 0.7;
    } else if (stats.goal === 'gain') {
      proteinCoeff = 2.2;
      carbCoeff = 6.0;
      fatCoeff = 1.0;
    } else {
      proteinCoeff = 1.4;
      carbCoeff = 4.0;
      fatCoeff = 0.9;
    }

    const proteinGrams = stats.weight * proteinCoeff;
    const fatGrams = stats.weight * fatCoeff;
    const carbGrams = stats.weight * carbCoeff;

    return {
      calories: Math.round((proteinGrams * 4) + (carbGrams * 4) + (fatGrams * 9)),
      proteins: Math.round(proteinGrams),
      carbs: Math.round(carbGrams),
      fats: Math.round(fatGrams),
    };
  }, [stats]);

  const saveToHistory = () => {
    const historyItem: HistoryItem = {
      id: crypto.randomUUID(),
      type: 'CALCULATION',
      timestamp: Date.now(),
      data: { ...needs, stats: { ...stats } }
    };
    
    const existing = JSON.parse(localStorage.getItem('nutrition_history') || '[]');
    localStorage.setItem('nutrition_history', JSON.stringify([...existing, historyItem]));
    setSaved(true);
  };

  const chartData = [
    { name: 'Protéines', value: needs.proteins * 4, color: '#22C55E' },
    { name: 'Glucides', value: needs.carbs * 4, color: '#16a34a' },
    { name: 'Lipides', value: needs.fats * 9, color: '#14532d' },
  ];

  const handleInputChange = (field: keyof UserStats, value: any) => {
    setStats(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-white italic">CALCULATEUR DE BESOINS</h2>
        <p className="text-[#22C55E]/70 font-mono text-sm uppercase">Optimisez votre métabolisme selon vos objectifs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-black/50 border border-green-900 rounded-3xl p-8 space-y-6 neon-border">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-green-700 uppercase tracking-widest block">Poids (kg)</label>
              <input 
                type="number" 
                value={stats.weight}
                onChange={(e) => handleInputChange('weight', Number(e.target.value))}
                className="w-full bg-green-950/20 border border-green-800 rounded-xl px-4 py-3 text-green-400 focus:outline-none focus:border-[#22C55E] font-bold transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-green-700 uppercase tracking-widest block">Taille (cm)</label>
              <input 
                type="number" 
                value={stats.height}
                onChange={(e) => handleInputChange('height', Number(e.target.value))}
                className="w-full bg-green-950/20 border border-green-800 rounded-xl px-4 py-3 text-green-400 focus:outline-none focus:border-[#22C55E] font-bold transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-green-700 uppercase tracking-widest block">Âge</label>
              <input 
                type="number" 
                value={stats.age}
                onChange={(e) => handleInputChange('age', Number(e.target.value))}
                className="w-full bg-green-950/20 border border-green-800 rounded-xl px-4 py-3 text-green-400 focus:outline-none focus:border-[#22C55E] font-bold transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-green-700 uppercase tracking-widest block">Genre</label>
              <select 
                value={stats.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full bg-green-950/20 border border-green-800 rounded-xl px-4 py-3 text-green-400 focus:outline-none focus:border-[#22C55E] font-bold transition-all appearance-none cursor-pointer"
              >
                <option value="male">HOMME</option>
                <option value="female">FEMME</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono text-green-700 uppercase tracking-widest block">Niveau d'activité</label>
            <select 
              value={stats.activityLevel}
              onChange={(e) => handleInputChange('activityLevel', e.target.value)}
              className="w-full bg-green-950/20 border border-green-800 rounded-xl px-4 py-3 text-green-400 focus:outline-none focus:border-[#22C55E] font-bold transition-all appearance-none cursor-pointer"
            >
              <option value="sedentary">SÉDENTAIRE (× 1.2)</option>
              <option value="light">LÉGER (1–3 séances/sem × 1.375)</option>
              <option value="moderate">MODÉRÉ (3–5 séances/sem × 1.55)</option>
              <option value="active">TRÈS ACTIF (6–7 séances/sem × 1.725)</option>
              <option value="extra">ATHLÈTE / TRAVAIL PHYSIQUE (× 1.9)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono text-green-700 uppercase tracking-widest block">Objectif</label>
            <div className="grid grid-cols-3 gap-2">
              {(['lose', 'maintain', 'gain'] as const).map(g => (
                <button
                  key={g}
                  onClick={() => handleInputChange('goal', g)}
                  className={`py-2 px-3 rounded-lg font-bold text-xs uppercase border transition-all ${
                    stats.goal === g 
                    ? 'bg-[#22C55E] text-black border-[#22C55E]' 
                    : 'bg-transparent text-green-700 border-green-900 hover:border-green-700'
                  }`}
                >
                  {g === 'lose' ? 'Sèche' : g === 'maintain' ? 'Maintien' : 'Masse'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-black/80 border border-[#22C55E] rounded-3xl p-8 shadow-[0_0_30px_rgba(34,197,94,0.1)] flex flex-col items-center justify-between">
            <div className="text-center w-full">
              <h3 className="text-[#22C55E] font-mono text-xs uppercase tracking-widest mb-2">Objectif journalier</h3>
              <div className="text-6xl font-black text-white tracking-tighter mb-4">
                {needs.calories} <span className="text-[#22C55E] text-xl font-mono uppercase">kcal</span>
              </div>
            </div>

            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #14532d', borderRadius: '8px' }}
                    itemStyle={{ color: '#22C55E', fontFamily: 'monospace' }}
                  />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full mt-4">
              <div className="text-center p-4 bg-green-950/20 rounded-2xl border border-green-900/50">
                <div className="text-2xl font-black text-white">{needs.proteins}g</div>
                <div className="text-[10px] text-[#22C55E] uppercase font-mono">Protéines</div>
              </div>
              <div className="text-center p-4 bg-green-950/20 rounded-2xl border border-green-900/50">
                <div className="text-2xl font-black text-white">{needs.carbs}g</div>
                <div className="text-[10px] text-[#22C55E] uppercase font-mono">Glucides</div>
              </div>
              <div className="text-center p-4 bg-green-950/20 rounded-2xl border border-green-900/50">
                <div className="text-2xl font-black text-white">{needs.fats}g</div>
                <div className="text-[10px] text-[#22C55E] uppercase font-mono">Lipides</div>
              </div>
            </div>
          </div>
          
          {!saved ? (
            <button 
              onClick={saveToHistory}
              className="w-full bg-[#22C55E] text-black py-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:scale-[1.02] transition-all"
            >
              Sauvegarder mon profil
            </button>
          ) : (
            <div className="w-full bg-green-900/20 border border-green-500/30 text-[#22C55E] py-4 rounded-2xl font-black uppercase text-center tracking-widest">
              Profil enregistré ✓
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyCalculator;
