import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Bot, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Wand2,
  Dumbbell,
  BrainCircuit,
  MessageSquare,
  Lightbulb,
  Terminal,
  ChevronRight
} from 'lucide-react';
import { getGeminiResponse, SYSTEM_INSTRUCTION } from '../services/geminiService';
import { FALLBACK_TASKS, Task } from '../constants';

interface Props {
  apiKey: string;
  onTaskCompleted: () => void;
}

interface HistoryEntry {
  topic: string;
  level: string;
  result: 'success' | 'fail';
  feedback: string;
  timestamp: number;
}

export default function TrainerSection({ apiKey, onTaskCompleted }: Props) {
  const [level, setLevel] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [topic, setTopic] = useState<'algorithm' | 'python'>('algorithm');
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [studentSolution, setStudentSolution] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const generateTask = async () => {
    setLoading(true);
    setAiResponse(null);
    setStudentSolution('');
    setShowFeedback(false);
    
    if (!apiKey) {
      const filtered = FALLBACK_TASKS.filter(t => t.level === level && t.topic === topic);
      setTask(filtered[Math.floor(Math.random() * filtered.length)] || FALLBACK_TASKS[0]);
      setLoading(false);
      return;
    }

    try {
      // Analyze history for adaptivity
      const recentErrors = history.filter(h => h.result === 'fail').slice(-3);
      const errorContext = recentErrors.length > 0 
        ? `Пайдаланушы соңғы рет мына мәселелерде қателесті: ${recentErrors.map(e => e.feedback).join('; ')}. Осы қателерді ескере отырып, білімін бекітуге бағытталған тапсырма бер.`
        : '';

      const prompt = `Маған жаңа тапсырма генерациялап бер. Деңгейі: ${level}. Тақырып: ${topic}. 
      ${errorContext}
      Тапсырма алгоритмдер (блок-схема логикасы) немесе Python бастапқы деңгейіне қатысты болсын.
      Маңызды: Пайдаланушы блок-схеманы суреттей алмайды, сондықтан одан блоктардың ретін немесе алгоритмнің мәтіндік түсіндірмесін сұра.
      Формат JSON: { "id": "gen", "level": "${level}", "topic": "${topic}", "goal": "мақсаты", "problem": "есептің мәтіні", "requirements": ["талап 1", "талап 2"], "criteria": "бағалау критерийі" }`;
      
      const response = await getGeminiResponse(apiKey, prompt, SYSTEM_INSTRUCTION);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) setTask(JSON.parse(jsonMatch[0]));
      else throw new Error("JSON not found");
    } catch {
      setTask(FALLBACK_TASKS[0]);
    } finally {
      setLoading(false);
    }
  };

  const checkSolution = async () => {
    if (!apiKey || !studentSolution.trim()) return;
    setChatLoading(true);
    try {
      const prompt = `Тапсырма: ${task?.problem}. Оқушының жауабы: ${studentSolution}. 
      Осы жауапты тексер. 
      Егер дұрыс болса, "Дұрыс! Жарайсың!" деп бастап мақтау бер және қысқаша неліктен дұрыс екенін айт. 
      Егер қате болса, қатесін терең талдап түсіндір, бірақ бірден дұрыс жауапты берме, бағытта.
      Соңында мына форматта қорытынды жаз: RESULT: [SUCCESS немесе FAIL]. FEEDBACK_SUMMARY: [қате туралы қысқаша 1 сөйлем]`;
      
      const resp = await getGeminiResponse(apiKey, prompt, SYSTEM_INSTRUCTION);
      setAiResponse(resp.split('RESULT:')[0]);
      setShowFeedback(true);

      const isSuccess = resp.includes('RESULT: SUCCESS');
      const feedbackMatch = resp.match(/FEEDBACK_SUMMARY: (.*)/);
      const summary = feedbackMatch ? feedbackMatch[1] : (isSuccess ? 'Жақсы орындалды' : 'Түсініктеме берілді');

      setHistory(prev => [...prev, {
        topic: task?.topic || topic,
        level: task?.level || level,
        result: isSuccess ? 'success' : 'fail',
        feedback: summary,
        timestamp: Date.now()
      }]);

      if (isSuccess) onTaskCompleted();
    } finally { setChatLoading(false); }
  };

  const askAI = async (msg: string) => {
    if (!apiKey) return setAiResponse("Кешіріңіз, ИИ көмегі үшін API кілті қажет.");
    setChatLoading(true);
    try {
      const prompt = `Контекст: 6-сынып оқушысы. Тапсырма: ${task?.problem}. Оқушының сұрағы: ${msg}. 
      Оған тікелей жауап берме, оны дұрыс бағытқа жетелейтін кеңес бер.`;
      const resp = await getGeminiResponse(apiKey, prompt, SYSTEM_INSTRUCTION);
      setAiResponse(resp);
      setShowFeedback(true);
    } finally { setChatLoading(false); }
  };

  const insight = (() => {
    const total = history.length;
    if (total === 0) return null;
    const successes = history.filter(h => h.result === 'success').length;
    const rate = Math.round((successes / total) * 100);
    const uniqueErrors = Array.from(new Set(history.filter(h => h.result === 'fail').map(h => h.feedback))).slice(-2);
    return { rate, uniqueErrors, total };
  })();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      {/* Sidebar Controls */}
      <div className="xl:col-span-4 space-y-6">
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
          <h2 className="text-xl font-black mb-8 flex items-center gap-3">
             <Wand2 className="text-blue-600" /> 
             Баптаулар
          </h2>
          
          <div className="space-y-8">
            <div>
              <label className="block text-xs font-black text-slate-400 mb-4 uppercase tracking-[0.2em]">Күрделілік</label>
              <div className="grid grid-cols-3 gap-2">
                {(['easy', 'medium', 'hard'] as const).map(l => (
                  <button 
                    key={l} 
                    onClick={() => setLevel(l)} 
                    className={`py-3 rounded-xl text-xs font-black transition-all border-2 ${
                      level === l 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                        : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {l === 'easy' ? 'ОҢАЙ' : l === 'medium' ? 'ОРТАША' : 'ҚЫЙЫН'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 mb-4 uppercase tracking-[0.2em]">Бағыт</label>
              <div className="flex gap-2">
                {(['algorithm', 'python'] as const).map(t => (
                  <button 
                    key={t} 
                    onClick={() => setTopic(t)} 
                    className={`flex-1 py-4 rounded-xl text-xs font-black transition-all border-2 flex flex-col items-center gap-2 ${
                      topic === t 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xl' 
                        : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {t === 'algorithm' ? <BrainCircuit size={20} /> : <Terminal size={20} />}
                    {t === 'algorithm' ? 'АЛГОРИТМ' : 'PYTHON'}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={generateTask} 
              disabled={loading} 
              className="w-full bg-blue-600 text-white font-black py-4 px-6 rounded-2xl hover:bg-blue-700 transition flex items-center justify-center gap-3 shadow-lg shadow-blue-100 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />} 
              ТАПСЫРМА АЛУ
            </button>
          </div>
        </div>

        {task && (
           <div className="bg-emerald-600 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              <h4 className="font-black mb-4 flex items-center gap-2 uppercase tracking-wide">
                 <CheckCircle2 size={20} /> Критерийлер
              </h4>
              <p className="text-emerald-100 text-sm font-medium leading-relaxed italic">
                 {task.criteria}
              </p>
           </div>
        )}

        {insight && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl space-y-6"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-black flex items-center gap-2 text-blue-400">
                <BrainCircuit size={20} /> AI ТАЛДАУ
              </h4>
              <span className="text-2xl font-black">{insight.rate}%</span>
            </div>
            
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${insight.rate}%` }}
                className="h-full bg-blue-500"
              />
            </div>

            {insight.uniqueErrors.length > 0 && (
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Мыналарға назар аудар:</p>
                {insight.uniqueErrors.map((err, i) => (
                  <div key={i} className="flex gap-3 text-xs font-bold text-slate-300 italic bg-white/5 p-3 rounded-xl">
                    <AlertCircle size={14} className="shrink-0 text-rose-400" /> {err}
                  </div>
                ))}
              </div>
            )}
            
            <div className="pt-4 border-t border-white/10 flex justify-between items-center text-[10px] font-black text-slate-500">
              <span>ОРЫНДАЛҒАН: {insight.total}</span>
              <span className="text-blue-400">АДАПТИВТІ РЕЖИМ ҚОСУЛЫ</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Main Trainer Stage */}
      <div className="xl:col-span-8 space-y-6">
        <AnimatePresence mode="wait">
          {!task ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full min-h-[500px] bg-white rounded-[2rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center p-12 text-center"
            >
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200">
                <Dumbbell size={48} />
              </div>
              <h3 className="text-2xl font-black text-slate-300 mb-2 uppercase">Шынығуды баста</h3>
              <p className="text-slate-400 max-w-xs font-medium">Сол жақтан деңгей мен тақырыпты таңдап, тапсырма генерацияла.</p>
            </motion.div>
          ) : (
            <motion.div 
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5"><BrainCircuit size={120} /></div>
                
                <div className="relative z-10">
                   <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-[0.2em] mb-6">
                      <ChevronRight size={14} /> Тапсырма
                   </div>
                   <h1 className="text-3xl font-black text-slate-900 mb-6 leading-tight">{task.goal}</h1>
                   <p className="text-lg text-slate-600 mb-10 font-medium leading-relaxed">{task.problem}</p>
                   
                   <div className="space-y-4 mb-10">
                      <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">Талаптар:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                         {task.requirements.map((req, i) => (
                           <div key={i} className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-black shrink-0">{i+1}</div>
                              <span className="text-sm font-bold text-slate-700">{req}</span>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-4">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Сенің жауабың (код немесе түсіндірме):</label>
                      <textarea 
                        className="w-full h-64 bg-slate-900 text-emerald-400 p-8 rounded-3xl font-mono text-lg focus:ring-4 focus:ring-blue-100 border-none transition-all outline-none" 
                        placeholder="Кодты осында жаз немесе алгоритмді сипатта..."
                        value={studentSolution} 
                        onChange={e => setStudentSolution(e.target.value)} 
                      />
                   </div>

                   <div className="flex flex-wrap gap-4 mt-8">
                      <button 
                        onClick={checkSolution} 
                        disabled={chatLoading || !studentSolution.trim()}
                        className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-black transition-all flex items-center gap-2 shadow-xl shadow-slate-200 disabled:opacity-50"
                      >
                        {chatLoading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />} ТЕКСЕРУ
                      </button>
                      <button 
                        onClick={() => askAI("Маған бағыт-бағдар берші")} 
                        disabled={chatLoading}
                        className="bg-white border-2 border-slate-200 px-8 py-4 rounded-2xl font-black hover:bg-slate-50 transition flex items-center gap-2 group"
                      >
                        <Bot size={20} className="group-hover:animate-bounce" /> ИИ КӨМЕК
                      </button>
                   </div>
                </div>
              </div>

              {showFeedback && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-900 rounded-[2rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden"
                >
                   <div className="absolute top-0 right-0 p-6 opacity-30"><MessageSquare size={48} /></div>
                   <div className="relative z-10">
                      <h4 className="flex items-center gap-3 font-black mb-6 uppercase tracking-wider text-blue-400">
                         <Bot size={24} /> Algo Көмекші:
                      </h4>
                      <div className="markdown-body text-slate-200 font-medium leading-loose text-lg">
                         {chatLoading ? (
                           <div className="flex items-center gap-3 text-slate-500 italic">
                             <Loader2 size={18} className="animate-spin" />
                             Жауап дайындалуда...
                           </div>
                         ) : aiResponse}
                      </div>
                   </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
