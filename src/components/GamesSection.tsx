import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Play, 
  GitBranchPlus, 
  Lightbulb, 
  RotateCcw, 
  Trophy, 
  ArrowRight,
  Code2,
  AlertCircle,
  Sparkles,
  Bot,
  Loader2,
  Terminal,
  Bug
} from 'lucide-react';
import { getGeminiResponse, SYSTEM_INSTRUCTION } from '../services/geminiService';

interface Props {
  apiKey: string;
  onPointsEarned: (points: number) => void;
}

export default function GamesSection({ apiKey, onPointsEarned }: Props) {
  const [activeGame, setActiveGame] = useState<'flowchart' | 'code' | 'debug' | null>(null);

  return (
    <div className="space-y-8">
      {!activeGame ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <GameCard 
            title="Блок-схема құрастыр"
            desc="Есептің шешу жолын дұрыс блоктар арқылы жина. Логикаңды тексер!"
            icon={<GitBranchPlus size={32} />}
            color="blue"
            onClick={() => setActiveGame('flowchart')}
          />
          <GameCard 
            title="Код нәтижесі"
            desc="Python коды фрагментін оқып, оның экранға не шығаратынын таңда."
            icon={<Code2 size={32} />}
            color="emerald"
            onClick={() => setActiveGame('code')}
          />
          <GameCard 
            title="AI Дебаггер"
            desc="AI жасаған қатесі бар кодты түзет. Нағыз программист бол!"
            icon={<Terminal size={32} />}
            color="indigo"
            onClick={() => setActiveGame('debug')}
          />
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] p-4 md:p-8 shadow-sm border border-slate-200 min-h-[700px] flex flex-col">
           <div className="flex justify-between items-center mb-8">
            <button 
              onClick={() => setActiveGame(null)}
              className="text-slate-500 hover:text-blue-600 transition flex items-center gap-2 font-bold w-fit"
            >
              ← Тізімге қайту
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-2xl text-xs font-black tracking-widest">
              <Sparkles size={14} className="text-blue-400" /> ИНТЕЛЛЕКТУАЛДЫ ОЙЫН
            </div>
           </div>
           
           <div className="flex-1">
            {activeGame === 'flowchart' && <FlowchartGame apiKey={apiKey} onPointsEarned={onPointsEarned} />}
            {activeGame === 'code' && <CodeResultGame apiKey={apiKey} onPointsEarned={onPointsEarned} />}
            {activeGame === 'debug' && <DebugGame apiKey={apiKey} onPointsEarned={onPointsEarned} />}
           </div>
        </div>
      )}
    </div>
  );
}

function GameCard({ title, desc, icon, color, onClick }: any) {
  const colors: any = {
    blue: 'bg-blue-600 shadow-blue-200 hover:shadow-blue-300 ring-blue-100',
    emerald: 'bg-emerald-600 shadow-emerald-200 hover:shadow-emerald-300 ring-emerald-100',
    indigo: 'bg-indigo-600 shadow-indigo-200 hover:shadow-indigo-300 ring-indigo-100'
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 cursor-pointer group transition-all"
    >
      <div className={`w-16 h-16 ${colors[color]} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:scale-110`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 mb-8 leading-relaxed">{desc}</p>
      <div className="flex items-center gap-2 font-black text-slate-900 group-hover:text-blue-600 transition-colors">
        Бастау <ArrowRight size={18} />
      </div>
    </motion.div>
  );
}

// Flowchart Game with Levels
function FlowchartGame({ onPointsEarned, apiKey }: { onPointsEarned: (p: number) => void, apiKey: string }) {
  const levels = [
    {
      title: "Екі санның қосындысы",
      blocks: [
        { id: '1', text: 'Басы', type: 'terminal', order: 1 },
        { id: '2', text: 'A, B енгізу', type: 'io', order: 2 },
        { id: '3', text: 'S = A + B', type: 'process', order: 3 },
        { id: '4', text: 'S шығару', type: 'io', order: 4 },
        { id: '5', text: 'Аяғы', type: 'terminal', order: 5 }
      ]
    },
    {
      title: "Жұп санды табу",
      blocks: [
        { id: '1', text: 'Басы', type: 'terminal', order: 1 },
        { id: '2', text: 'X енгізу', type: 'io', order: 2 },
        { id: '3', text: 'X % 2 == 0?', type: 'decision', order: 3 },
        { id: '4', text: '"Жұп" шығару', type: 'io', order: 4 },
        { id: '5', text: 'Аяғы', type: 'terminal', order: 5 }
      ]
    },
    {
      title: "Цикл (1-ден 3-ке дейін)",
      blocks: [
        { id: '1', text: 'Басы', type: 'terminal', order: 1 },
        { id: '2', text: 'i = 1', type: 'process', order: 2 },
        { id: '3', text: 'i <= 3?', type: 'decision', order: 3 },
        { id: '4', text: 'i шығару', type: 'io', order: 4 },
        { id: '5', text: 'i = i + 1', type: 'process', order: 5 },
        { id: '6', text: 'Аяғы', type: 'terminal', order: 6 }
      ]
    }
  ];

  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: '' });
  const [isFinished, setIsFinished] = useState(false);
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const level = levels[currentLevel];

  const getAiHelp = async () => {
    setAiLoading(true);
    try {
      const prompt = `Мен "${level.title}" алгоритмін құрастырып жатырмын. Блоктар: ${level.blocks.map(b => b.text).join(', ')}. 
      Маған келесі қадам қандай болатынына кішкене бағыт бер (тікелей жауап емес, логикалық нұсқау).`;
      const resp = await getGeminiResponse('', prompt, SYSTEM_INSTRUCTION);
      setAiTip(resp);
    } catch {
      setAiTip("Қателік орын алды.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleBlockClick = (id: string) => {
    if (isFinished) return;
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
    setFeedback({ type: null, msg: '' });
  };

  const checkResult = () => {
    const isCorrect = selectedIds.length === level.blocks.length && 
      selectedIds.every((id, idx) => level.blocks.find(b => b.id === id)?.order === idx + 1);
    
    if (isCorrect) {
      setFeedback({ type: 'success', msg: 'Керемет! Реттілік дұрыс жиналды! +10 ұпай' });
      onPointsEarned(10);
      setIsFinished(true);
    } else {
      setFeedback({ type: 'error', msg: 'Қателік бар. Блоктардың ретін қайта тексер.' });
    }
  };

  const nextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
      setSelectedIds([]);
      setFeedback({ type: null, msg: '' });
      setIsFinished(false);
    } else {
      // Game Over / Win
    }
  };

  const getShapeClass = (type: string) => {
    switch(type) {
      case 'terminal': return 'rounded-full px-8 py-3 bg-orange-100 border-orange-400 text-orange-800'; // Oval
      case 'io': return 'skew-x-[-12deg] px-6 py-3 bg-blue-100 border-blue-400 text-blue-800'; // Parallelogram
      case 'process': return 'rounded-none px-6 py-3 bg-emerald-100 border-emerald-400 text-emerald-800'; // Rectangle
      case 'decision': return 'rotate-45 w-24 h-24 flex items-center justify-center bg-yellow-100 border-yellow-400 text-yellow-800 text-center'; // Diamond
      default: return 'rounded-xl px-6 py-3 bg-slate-100 border-slate-400';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Деңгей {currentLevel + 1}: {level.title}</h2>
          <p className="text-slate-500 text-sm">Блоктарды дұрыс ретпен таңдап, алгоритм құрастыр.</p>
        </div>
        <div className="text-blue-600 font-bold bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
          {currentLevel + 1} / {levels.length}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center py-8">
        {level.blocks.map((block) => {
          const isSelected = selectedIds.includes(block.id);
          return (
            <motion.button
              key={block.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBlockClick(block.id)}
              disabled={isFinished}
              className={`relative transition-all border-2 font-bold text-sm ${getShapeClass(block.type)} ${
                isSelected ? 'ring-4 ring-blue-200 border-blue-600 opacity-50' : 'hover:border-slate-800'
              }`}
            >
              <span className={block.type === 'decision' ? '-rotate-45 block w-20' : ''}>
                {block.text}
              </span>
              {isSelected && (
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs shadow-md">
                  {selectedIds.indexOf(block.id) + 1}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 flex flex-col items-center gap-6 min-h-[300px]">
        <h4 className="text-slate-400 font-bold uppercase tracking-widest text-xs">Алгоритм схемасы</h4>
        
        {selectedIds.length === 0 ? (
          <div className="flex-1 flex items-center text-slate-300 italic">Блоктарды таңдаңыз...</div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4">
            {selectedIds.map((id, idx) => {
              const b = level.blocks.find(block => block.id === id)!;
              return (
                <div key={id} className="flex flex-col items-center gap-4">
                   <div className={`border-2 font-bold shadow-sm ${getShapeClass(b.type)} animate-in fade-in zoom-in duration-300`}>
                      <span className={b.type === 'decision' ? '-rotate-45 block w-24 text-center' : ''}>{b.text}</span>
                   </div>
                   {idx < selectedIds.length - 1 && <div className="w-1 h-6 bg-slate-300 rounded-full" />}
                </div>
              );
            })}
          </div>
        )}

        <div className="w-full flex flex-col items-center gap-4 pt-8">
          <div className="flex gap-4">
            <button 
              onClick={getAiHelp}
              disabled={aiLoading}
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-100 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all disabled:opacity-50"
            >
              {aiLoading ? <Loader2 className="animate-spin" size={18} /> : <Bot size={18} />} AI Көмек
            </button>
          </div>

          <AnimatePresence>
            {aiTip && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full max-w-2xl bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4 text-blue-800"
              >
                <Sparkles className="shrink-0 text-blue-500" />
                <p className="text-sm font-medium italic italic leading-relaxed">{aiTip}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {feedback.msg && (
            <div className={`w-full max-w-md p-4 rounded-xl flex items-center gap-2 font-bold ${
              feedback.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}>
              {feedback.type === 'success' ? <CheckCircle2 /> : <AlertCircle />}
              {feedback.msg}
            </div>
          )}

          {!isFinished ? (
            <button 
              onClick={checkResult}
              disabled={selectedIds.length !== level.blocks.length}
              className="bg-slate-900 text-white px-12 py-4 rounded-xl font-bold hover:bg-black transition-all disabled:opacity-30"
            >
              Тексеру
            </button>
          ) : (
            <div className="flex gap-4">
              <button onClick={() => { setSelectedIds([]); setIsFinished(false); }} className="px-8 py-4 border-2 rounded-xl font-bold flex items-center gap-2">
                <RotateCcw size={18} /> Қайталау
              </button>
              <button 
                onClick={nextLevel}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700"
              >
                Келесі деңгей <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Code Result Game with Levels
function CodeResultGame({ onPointsEarned, apiKey }: { onPointsEarned: (p: number) => void, apiKey: string }) {
  const levels = [
    {
      code: "x = 10\ny = 2\nprint(x / y)",
      options: ["5", "5.0", "12"],
      correct: 1, // Notice: Python division returns float
      explanation: "Python-да / операторы әрқашан ондық сан (float) қайтарады."
    },
    {
      code: "name = 'Algo'\nprint(name * 2)",
      options: ["Algo2", "AlgoAlgo", "Error"],
      correct: 1,
      explanation: "Мәтінді санға көбейткенде, ол сонша рет қайталанады."
    },
    {
      code: "for i in range(1, 4):\n    print(i, end='')",
      options: ["1234", "123", "0123"],
      correct: 1,
      explanation: "range(1, 4) 1, 2, 3 сандарын береді (соңғы сан кірмейді)."
    },
    {
      code: "x = 5\nif x > 5:\n    print('A')\nelif x == 5:\n    print('B')\nelse:\n    print('C')",
      options: ["A", "B", "C"],
      correct: 1,
      explanation: "x тура 5-ке тең, сондықтан elif x == 5 шарты орындалады."
    },
    {
      code: "s = 'Python'\nprint(s[0])",
      options: ["P", "y", "n"],
      correct: 0,
      explanation: "Python-да индекстеу 0-ден басталады, s[0] - бірінші әріп."
    }
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const level = levels[currentIdx];

  const getAiHelp = async () => {
    setAiLoading(true);
    try {
      const prompt = `Python коды: ${level.code}. Маған осы кодтың қалай жұмыс істейтіні туралы қысқаша нұсқау бер, бірақ жауапты айтпа.`;
      const resp = await getGeminiResponse('', prompt, SYSTEM_INSTRUCTION);
      setAiTip(resp);
    } catch {
      setAiTip("Қателік орын алды.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleChoice = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);
    if (idx === level.correct) onPointsEarned(10);
  };

  const next = () => {
    if (currentIdx < levels.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedIdx(null);
      setIsAnswered(false);
    } else {
      // Finish
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-slate-800">Код не шығарады?</h2>
        <p className="text-slate-500">Python кодының орындалу нәтижесін дұрыс тап.</p>
      </div>

      <div className="bg-slate-900 text-emerald-400 p-8 rounded-2xl font-mono text-lg shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 text-slate-700 font-sans text-xs uppercase font-black">Python 3.10</div>
        <pre className="relative z-10">{level.code}</pre>
        <button 
          onClick={getAiHelp}
          disabled={aiLoading}
          className="absolute bottom-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white transition disabled:opacity-50"
        >
          {aiLoading ? <Loader2 className="animate-spin" size={16} /> : <Bot size={16} />}
        </button>
      </div>

      <AnimatePresence>
        {aiTip && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-emerald-800 text-xs font-bold italic"
          >
            AI Көмек: {aiTip}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {level.options.map((opt, i) => {
          let statusColor = 'bg-slate-50 border-slate-100 hover:border-blue-400';
          if (isAnswered) {
             if (i === level.correct) statusColor = 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-4 ring-emerald-100';
             else if (i === selectedIdx) statusColor = 'bg-rose-50 border-rose-500 text-rose-800';
             else statusColor = 'bg-slate-50 border-slate-100 opacity-30';
          }

          return (
            <button
              key={i}
              onClick={() => handleChoice(i)}
              className={`p-6 rounded-2xl border-2 font-bold text-xl transition-all ${statusColor}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {isAnswered && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
             <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
                <h5 className="flex items-center gap-2 font-bold text-blue-900 mb-2">
                   <Lightbulb size={18} /> Түсіндірме:
                </h5>
                <p className="text-blue-700 leading-relaxed font-medium italic">{level.explanation}</p>
             </div>

             <div className="flex justify-center">
                <button 
                  onClick={next}
                   className="bg-slate-900 text-white px-12 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-all"
                >
                  {currentIdx === levels.length -1 ? 'Аяқтау' : 'Келесі тапсырма'} <ArrowRight size={18} />
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Debug Game component
function DebugGame({ apiKey, onPointsEarned }: { apiKey: string, onPointsEarned: (p: number) => void }) {
  const levels = [
    {
      buggyCode: "x = input('Сан енгіз')\nprint(x + 5)",
      error: "TypeError: can only concatenate str (not 'int') to str",
      options: [
        "x = int(input('Сан енгіз'))",
        "print(int(x + 5))",
        "x = float(x + 5)"
      ],
      correct: 0,
      explanation: "input() әрқашан мәтін (str) қайтарады. Онымен математикалық амал жасау үшін int() немесе float() арқылы санға айналдыру керек."
    },
    {
      buggyCode: "if x = 10:\n    print('Он')",
      error: "SyntaxError: invalid syntax",
      options: [
        "if x == 10",
        "if x == 10:",
        "if (x = 10):"
      ],
      correct: 1,
      explanation: "Теңдікті тексеру үшін == қолданылады және шарттан кейін қос нүкте (:) қойылуы тиіс."
    },
    {
      buggyCode: "for i in range(5)\nprint(i)",
      error: "IndentationError: expected an indented block",
      options: [
        "for i in range(5):\nprint(i)",
        "for i in range(5):\n    print(i)",
        "for i in range(5): print(i)"
      ],
      correct: 1,
      explanation: "Цикл немесе шарт ішіндегі код міндетті түрде бос орынмен (indentation) жазылуы керек."
    }
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const level = levels[currentIdx];

  const getAiHelp = async () => {
    setAiLoading(true);
    try {
      const prompt = `Кодта қате бар: ${level.buggyCode}. Қате түрі: ${level.error}. Маған осыны қалай түзетуге болатыны туралы кішкене көмек бер, бірақ тура жауабын айтпа.`;
      const resp = await getGeminiResponse('', prompt, SYSTEM_INSTRUCTION);
      setAiTip(resp);
    } catch {
      setAiTip("Қателік орын алды.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleChoice = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);
    if (idx === level.correct) onPointsEarned(15);
  };

  const next = () => {
    if (currentIdx < levels.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedIdx(null);
      setIsAnswered(false);
      setAiTip(null);
    } else {
      // Done
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-slate-800 flex items-center justify-center gap-2">
          <Bug className="text-rose-500" /> Қатені тап!
        </h2>
        <p className="text-slate-500">Берілген кодтағы қатені тауып, дұрыс нұсқасын таңда.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-2xl p-6 shadow-xl relative group">
           <div className="absolute top-2 right-2 text-[10px] text-rose-400 font-bold uppercase tracking-widest bg-rose-400/10 px-2 py-1 rounded">Қате код</div>
           <pre className="font-mono text-emerald-400 text-lg">{level.buggyCode}</pre>
           <div className="mt-4 pt-4 border-t border-white/10 font-mono text-rose-400 text-sm">
             {level.error}
           </div>
        </div>

        <div className="space-y-4">
           {level.options.map((opt, i) => {
             let borderClass = 'border-slate-100 hover:border-blue-400 bg-slate-50';
             if (isAnswered) {
               if (i === level.correct) borderClass = 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-100';
               else if (i === selectedIdx) borderClass = 'border-rose-500 bg-rose-50';
               else borderClass = 'opacity-30 border-slate-100';
             }

             return (
               <button
                 key={i}
                 onClick={() => handleChoice(i)}
                 className={`w-full text-left p-4 rounded-xl border-2 font-mono text-sm transition-all ${borderClass}`}
               >
                 {opt}
               </button>
             );
           })}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <button 
          onClick={getAiHelp}
          disabled={aiLoading || isAnswered}
          className="flex items-center gap-2 px-6 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition disabled:opacity-30"
        >
          {aiLoading ? <Loader2 className="animate-spin" size={16} /> : <Bot size={16} />} AI Көмекші
        </button>

        <AnimatePresence>
          {aiTip && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-xl bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm italic text-blue-800"
            >
              {aiTip}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isAnswered && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
             <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl">
                <h5 className="font-bold text-emerald-900 mb-2">Түсіндірме:</h5>
                <p className="text-emerald-700 leading-relaxed italic">{level.explanation}</p>
             </div>
             
             <div className="flex justify-center">
                <button 
                  onClick={next}
                  className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all"
                >
                  {currentIdx === levels.length - 1 ? 'Аяқтау' : 'Келесі деңгей'} <ArrowRight size={18} />
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
