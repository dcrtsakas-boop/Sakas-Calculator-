
import React, { useState, useEffect } from 'react';
import { HistoryItem } from '../types';

const HistoryDisplay: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('nutrition_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const clearHistory = () => {
    if (confirm('Voulez-vous vraiment effacer tout l\'historique ?')) {
      localStorage.removeItem('nutrition_history');
      setHistory([]);
    }
  };

  const removeItem = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('nutrition_history', JSON.stringify(updated));
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div className="text-left space-y-2">
          <h2 className="text-3xl font-black text-white italic">HISTORIQUE</h2>
          <p className="text-[#22C55E]/70 font-mono text-sm uppercase">Vos données sauvegardées</p>
        </div>
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="text-xs font-mono border border-red-900/50 text-red-500 hover:bg-red-500 hover:text-white px-3 py-2 rounded transition-all uppercase"
          >
            Effacer tout
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="border border-green-900/30 rounded-3xl p-12 text-center bg-black/40">
          <p className="text-green-800 font-mono uppercase tracking-widest">Aucune donnée enregistrée pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {history.sort((a, b) => b.timestamp - a.timestamp).map((item) => (
            <div key={item.id} className="bg-green-950/10 border border-green-900/50 rounded-2xl p-6 flex flex-col md:flex-row justify-between gap-6 hover:border-[#22C55E]/50 transition-all group">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.type === 'PHOTO' ? 'bg-[#22C55E] text-black' : 'bg-blue-600 text-white'}`}>
                    {item.type === 'PHOTO' ? 'Analyse Photo' : 'Calcul Besoins'}
                  </span>
                  <span className="text-green-900 font-mono text-xs italic">{formatDate(item.timestamp)}</span>
                </div>
                
                {item.type === 'PHOTO' ? (
                  <div>
                    <h3 className="text-xl font-black text-white uppercase italic">{(item.data as any).foodName}</h3>
                    <p className="text-green-700 text-xs line-clamp-2">{(item.data as any).description}</p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-black text-white uppercase italic">Profil Nutritionnel</h3>
                    <p className="text-green-700 text-xs">Objectif : {(item.data as any).stats.goal === 'lose' ? 'Sèche' : (item.data as any).stats.goal === 'maintain' ? 'Maintien' : 'Masse'}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-8 md:gap-12 bg-black/40 px-6 py-3 rounded-xl border border-green-900/20">
                <div className="text-center">
                  <div className="text-lg font-black text-white">{(item.data as any).calories}</div>
                  <div className="text-[10px] text-green-700 font-mono uppercase">kcal</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-black text-white">{(item.data as any).proteins}g</div>
                  <div className="text-[10px] text-green-700 font-mono uppercase">Prot</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-black text-white">{(item.data as any).carbs}g</div>
                  <div className="text-[10px] text-green-700 font-mono uppercase">Glu</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-black text-white">{(item.data as any).fats}g</div>
                  <div className="text-[10px] text-green-700 font-mono uppercase">Lip</div>
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="md:opacity-0 group-hover:opacity-100 text-red-500 hover:scale-110 transition-all ml-4"
                  title="Supprimer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryDisplay;
