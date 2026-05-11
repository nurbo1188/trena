/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  ClipboardCheck, 
  Gamepad2, 
  Dumbbell, 
  BarChart3, 
  MessageSquare,
  Code2,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Stats } from './constants';
import TheorySection from './components/TheorySection';
import TestSection from './components/TestSection';
import GamesSection from './components/GamesSection';
import TrainerSection from './components/TrainerSection';
import StatsSection from './components/StatsSection';
import AIChatBot from './components/AIChatBot';
import PythonEditor from './components/PythonEditor';

export default function App() {
  const [activeTab, setActiveTab] = useState<'theory' | 'test' | 'games' | 'trainer' | 'chat' | 'editor' | 'stats'>('theory');
  const [stats, setStats] = useState<Stats>({
    testScores: [],
    gamePoints: 0,
    completedTasks: 0
  });

  useEffect(() => {
    const savedStats = localStorage.getItem('algo_step_stats');
    if (savedStats) setStats(JSON.parse(savedStats));
  }, []);

  const saveStats = (newStats: Stats) => {
    setStats(newStats);
    localStorage.setItem('algo_step_stats', JSON.stringify(newStats));
  };

  const tabs = [
    { id: 'theory', name: 'ОҚЫТУ', icon: BookOpen },
    { id: 'test', name: 'ТЕСТ', icon: ClipboardCheck },
    { id: 'games', name: 'ОЙЫНДАР', icon: Gamepad2 },
    { id: 'trainer', name: 'ТРЕНАЖЁР', icon: Dumbbell },
    { id: 'editor', name: 'PYTHON IDE', icon: Code2 },
    { id: 'chat', name: 'AI ЧАТ', icon: MessageSquare },
    { id: 'stats', name: 'ПРОГРЕСС', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              AS
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hidden sm:block">
              AlgoStep
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-black uppercase tracking-widest border border-emerald-100">
               <Sparkles size={14} /> AI ҚОСУЛЫ
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="max-w-7xl mx-auto px-4 py-2 flex gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <tab.icon size={18} />
              {tab.name}
            </button>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {activeTab === 'theory' && <TheorySection apiKey="" />}
            {activeTab === 'test' && (
              <TestSection 
                apiKey=""
                onFinish={(score) => saveStats({ ...stats, testScores: [...stats.testScores.slice(-10), score] })} 
              />
            )}
            {activeTab === 'games' && (
              <GamesSection 
                apiKey=""
                onPointsEarned={(points) => saveStats({ ...stats, gamePoints: stats.gamePoints + points })} 
              />
            )}
            {activeTab === 'trainer' && (
              <TrainerSection 
                apiKey=""
                onTaskCompleted={() => saveStats({ ...stats, completedTasks: stats.completedTasks + 1 })}
              />
            )}
            {activeTab === 'editor' && <PythonEditor />}
            {activeTab === 'chat' && <div className="bg-white rounded-3xl p-8 border border-slate-200 h-[700px] overflow-hidden"><AIChatBot apiKey="" embedded /></div>}
            {activeTab === 'stats' && <StatsSection stats={stats} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm font-medium">
          <p>© 2026 AlgoStep — 6-сынып информатика тренажёрі</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-blue-600">Көмек</a>
            <a href="#" className="hover:text-blue-600">Ресурстар</a>
          </div>
        </div>
      </footer>
      <AIChatBot apiKey="" />
    </div>
  );
}
