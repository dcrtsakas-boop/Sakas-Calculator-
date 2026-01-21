
import React, { useState } from 'react';
import { AppMode } from './types';
import PhotoAnalyzer from './components/PhotoAnalyzer';
import DailyCalculator from './components/DailyCalculator';
import HistoryDisplay from './components/HistoryDisplay';
import Layout from './components/Layout';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('ANALYZE');

  return (
    <Layout mode={mode} setMode={setMode}>
      <main className="max-w-4xl mx-auto px-4 py-8">
        {mode === 'ANALYZE' && <PhotoAnalyzer />}
        {mode === 'CALCULATE' && <DailyCalculator />}
        {mode === 'HISTORY' && <HistoryDisplay />}
      </main>
    </Layout>
  );
};

export default App;
