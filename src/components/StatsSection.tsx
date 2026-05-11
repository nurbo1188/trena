import { motion } from 'motion/react';
import { 
  Trophy, 
  Star, 
  Target, 
  CheckCircle, 
  Award, 
  Medal, 
  Zap, 
  BrainCircuit,
  Rocket,
  ClipboardCheck
} from 'lucide-react';
import { Stats } from '../constants';

interface Props {
  stats: Stats;
}

export default function StatsSection({ stats }: Props) {
  const lastScore = stats.testScores.length > 0 ? stats.testScores[stats.testScores.length - 1] : 0;
  const avgScore = stats.testScores.length > 0 
    ? Math.round((stats.testScores.reduce((a, b) => a + b, 0) / stats.testScores.length) * 20) 
    : 0;

  const totalActions = stats.gamePoints + (stats.completedTasks * 50) + (stats.testScores.length * 20);
  
  const getLevel = (xp: number) => {
    if (xp < 100) return { name: 'Бастаушы', color: 'text-slate-400', icon: <Rocket size={24} /> };
    if (xp < 500) return { name: 'Программист', color: 'text-blue-500', icon: <Zap size={24} /> };
    if (xp < 1500) return { name: 'Алгоритм Шебері', color: 'text-indigo-500', icon: <BrainCircuit size={24} /> };
    return { name: 'AlgoWizard', color: 'text-emerald-500', icon: <Award size={24} /> };
  };

  const level = getLevel(totalActions);

  const badges = [
    { id: 'first_task', label: 'Алғашқы қадам', active: stats.completedTasks > 0, icon: <Medal size={20} /> },
    { id: 'test_pro', label: 'Тест үздігі', active: stats.testScores.some(s => s >= 5), icon: <Star size={20} /> },
    { id: 'gamer', label: 'Ойын шебері', active: stats.gamePoints > 200, icon: <Gamepad size={20} /> },
    { id: 'task_hero', label: 'Тапсырма батыры', active: stats.completedTasks >= 5, icon: <Trophy size={20} /> },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Level Header */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          {level.icon}
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
           <div className={`w-24 h-24 rounded-3xl bg-white/10 flex items-center justify-center text-4xl shadow-inner border border-white/10 ${level.color}`}>
              {level.icon}
           </div>
           <div className="text-center md:text-left space-y-2">
             <div className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Сенің деңгейің</div>
             <h2 className={`text-4xl font-black uppercase tracking-tighter ${level.color}`}>{level.name}</h2>
             <div className="flex items-center gap-4 pt-2">
               <div className="flex-1 h-2 bg-white/5 rounded-full w-48 md:w-80 overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${Math.min((totalActions % 500) / 5, 100)}%` }}
                   className="h-full bg-blue-500"
                 />
               </div>
               <span className="text-xs font-mono text-slate-400">{totalActions} XP</span>
             </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<Trophy className="text-yellow-500" />} 
          label="Ойын ұпайлары" 
          value={stats.gamePoints} 
          color="bg-yellow-50"
        />
        <StatCard 
          icon={<Target className="text-blue-500" />} 
          label="Тест нәтижесі (орташа)" 
          value={`${avgScore}%`} 
          color="bg-blue-50"
        />
        <StatCard 
          icon={<CheckCircle className="text-emerald-500" />} 
          label="Орындалған тапсырма" 
          value={stats.completedTasks} 
          color="bg-emerald-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Badges */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Medal className="text-indigo-500" /> Жетістіктер
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {badges.map(badge => (
              <div 
                key={badge.id}
                className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${
                  badge.active ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 scale-100' : 'bg-slate-50 text-slate-300 opacity-50 grayscale'
                }`}
              >
                {badge.icon}
                <span className="text-[10px] font-black uppercase tracking-widest text-center">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <ClipboardCheck className="text-blue-500" /> Соңғы нәтижелер
          </h3>
          <div className="space-y-4 max-h-[250px] overflow-y-auto no-scrollbar">
            {stats.testScores.length === 0 ? (
              <p className="text-slate-400 italic text-sm">Әзірге тест тапсырылмаған...</p>
            ) : (
              stats.testScores.map((score, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-xs text-slate-500 uppercase">Тест #{i+1}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black">{score}/15</span>
                    <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500" style={{ width: `${(score/15)*100}%` }} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: any, label: string, value: any, color: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`${color} rounded-3xl p-8 border border-slate-200 shadow-sm transition-all`}
    >
      <div className="mb-4">{icon}</div>
      <div className="text-3xl font-black text-slate-900 mb-1">{value}</div>
      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</div>
    </motion.div>
  );
}

function Gamepad({ size, className }: any) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="6" y1="12" x2="10" y2="12" />
      <line x1="8" y1="10" x2="8" y2="14" />
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="15.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="15.5" cy="13.5" r=".5" fill="currentColor" />
      <circle cx="18.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="18.5" cy="13.5" r=".5" fill="currentColor" />
    </svg>
  );
}

