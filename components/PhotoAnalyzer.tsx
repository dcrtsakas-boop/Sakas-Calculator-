
import React, { useState, useRef } from 'react';
import { analyzeFoodImage } from '../services/geminiService';
import { NutritionInfo, HistoryItem } from '../types';
import NutrientDisplay from './NutrientDisplay';

const PhotoAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NutritionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setImage(reader.result as string);
        processImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (base64: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setSaved(false);
    try {
      const nutrition = await analyzeFoodImage(base64);
      setResult(nutrition);
    } catch (err) {
      setError("Échec de l'analyse de l'image. Veuillez réessayer.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveToHistory = () => {
    if (!result) return;
    const historyItem: HistoryItem = {
      id: crypto.randomUUID(),
      type: 'PHOTO',
      timestamp: Date.now(),
      data: result
    };
    
    const existing = JSON.parse(localStorage.getItem('nutrition_history') || '[]');
    localStorage.setItem('nutrition_history', JSON.stringify([...existing, historyItem]));
    setSaved(true);
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
    setSaved(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-white italic">ANALYSEUR VISUEL</h2>
        <p className="text-[#22C55E]/70 font-mono text-sm uppercase">Identifiez vos macros instantanément via la vision AI</p>
      </div>

      {!image ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="group cursor-pointer border-2 border-dashed border-green-900 hover:border-[#22C55E] rounded-2xl h-80 flex flex-col items-center justify-center transition-all duration-500 bg-green-950/5 hover:bg-green-950/20"
        >
          <div className="w-20 h-20 mb-4 bg-green-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-[#22C55E] font-bold text-lg text-center px-4 uppercase">PRENDRE UNE PHOTO / UPLOADER</p>
          <p className="text-green-900 font-mono text-xs mt-2 uppercase">Formats supportés : JPG, PNG, WEBP</p>
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className={`relative rounded-2xl overflow-hidden group transition-all duration-500 ${loading ? 'image-pulse border-2 border-[#22C55E]' : 'neon-border border border-green-900'}`}>
            <img src={image} alt="Nourriture" className={`w-full h-auto object-cover max-h-[400px] transition-all duration-700 ${loading ? 'scale-105 brightness-50 contrast-125' : 'scale-100'}`} />
            
            {loading && <div className="scan-line"></div>}

            <div className={`absolute inset-0 bg-black/40 transition-opacity flex flex-col items-center justify-center gap-4 ${loading ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
              <button 
                onClick={reset}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:bg-red-600 transition-colors uppercase text-sm"
              >
                ANNULER & RECOMMENCER
              </button>
              {result && !saved && (
                <button 
                  onClick={saveToHistory}
                  className="bg-[#22C55E] text-black px-4 py-2 rounded-lg font-bold shadow-lg hover:bg-green-400 transition-colors uppercase text-sm"
                >
                  Sauvegarder
                </button>
              )}
            </div>

            {loading && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center space-y-4">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 border-4 border-green-900 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-[#22C55E] rounded-full border-t-transparent animate-spin"></div>
                </div>
                <div className="text-[#22C55E] font-mono text-center px-4">
                  <p className="animate-pulse font-bold tracking-widest">DÉCHIFFREMENT DES DONNÉES...</p>
                  <p className="text-[10px] text-green-400 mt-2 opacity-60">ANALYSE DE LA SIGNATURE ALIMENTAIRE</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {error && (
              <div className="bg-red-950/20 border border-red-900 p-4 rounded-xl text-red-500 font-bold flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {result && (
              <div className="space-y-4 animate-slideIn">
                <NutrientDisplay data={result} />
                {!saved ? (
                  <button 
                    onClick={saveToHistory}
                    className="w-full bg-[#22C55E] text-black py-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:scale-[1.02] transition-all"
                  >
                    Sauvegarder dans l'historique
                  </button>
                ) : (
                  <div className="w-full bg-green-900/20 border border-green-500/30 text-[#22C55E] py-4 rounded-2xl font-black uppercase text-center tracking-widest">
                    Données enregistrées ✓
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoAnalyzer;
