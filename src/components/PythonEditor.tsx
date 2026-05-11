import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  RotateCcw, 
  Terminal, 
  Bug, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Trash2,
  Copy,
  Download,
  Code2
} from 'lucide-react';

declare global {
  interface Window {
    loadPyodide: any;
  }
}

export default function PythonEditor() {
  const [code, setCode] = useState('print("Сәлем, AlgoStep!")\n\n# Екі санды қосу\na = 10\nb = 5\nprint(f"{a} + {b} = {a + b}")');
  const [output, setOutput] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [pyodide, setPyodide] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPy = async () => {
      try {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
        script.onload = async () => {
          const py = await window.loadPyodide();
          setPyodide(py);
          setIsLoading(false);
        };
        document.head.appendChild(script);
      } catch (e) {
        console.error('Failed to load Pyodide', e);
        setError('Python жүйесін жүктеу мүмкін болмады. Интернет байланысын тексеріңіз.');
      }
    };
    loadPy();
  }, []);

  const runCode = async () => {
    if (!pyodide || isRunning) return;
    setIsRunning(true);
    setOutput([]);
    setError(null);

    try {
      // Capture stdout
      pyodide.setStdout({
        batched: (msg: string) => {
          setOutput(prev => [...prev, msg]);
        }
      });

      await pyodide.runPythonAsync(code);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  const clearOutput = () => setOutput([]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-[700px] animate-in fade-in duration-500">
      {/* Editor Side */}
      <div className="lg:col-span-12 xl:col-span-7 flex flex-col space-y-4">
        <div className="bg-white rounded-[2.5rem] p-6 border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg">
                <Code2 size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Python Editor v3.10</h2>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-emerald-400'}`}></span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {isLoading ? 'Жүктелуде...' : 'Дайын'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
               <button 
                onClick={runCode}
                disabled={isLoading || isRunning}
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-black text-xs hover:bg-emerald-700 transition flex items-center gap-2 shadow-lg shadow-emerald-100 disabled:opacity-50"
              >
                {isRunning ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} fill="currentColor" />}
                RUN CODE
              </button>
            </div>
          </div>

          <div className="flex-1 relative group">
            <div className="absolute top-4 left-4 z-10 space-y-1 opacity-20 group-hover:opacity-100 transition-opacity">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="text-[10px] font-mono text-slate-400 text-right w-6 leading-6">{i + 1}</div>
              ))}
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-slate-900 text-emerald-400 p-6 pl-14 rounded-3xl font-mono text-lg resize-none focus:ring-4 focus:ring-emerald-400/10 transition-all outline-none border-none shadow-2xl leading-6"
              spellCheck={false}
              autoFocus
            />
          </div>
        </div>
      </div>

      {/* Output Side */}
      <div className="lg:col-span-12 xl:col-span-5 flex flex-col space-y-4">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-white/5 shadow-2xl flex flex-col flex-1 overflow-hidden min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-[0.2em]">
              <Terminal className="text-emerald-400" size={16} />
              Console Output
            </h3>
            <button 
              onClick={clearOutput}
              className="text-slate-500 hover:text-white transition"
              title="Тазалау"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="flex-1 font-mono text-lg overflow-y-auto space-y-2 custom-scrollbar">
            {output.length === 0 && !error && !isRunning && (
              <div className="text-slate-600 italic text-sm">Нәтиже күтілуде...</div>
            )}
            
            {isRunning && (
              <div className="flex items-center gap-3 text-emerald-400 text-sm italic">
                <Loader2 className="animate-spin" size={16} />
                Орындалуда...
              </div>
            )}

            {output.map((line, i) => (
              <div key={i} className="text-emerald-400 animate-in fade-in slide-in-from-left-2 duration-300">
                <span className="text-slate-700 mr-2 opacity-50">›</span>
                {line}
              </div>
            ))}

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl space-y-2 mt-4 animate-in shake-in">
                <div className="flex items-center gap-2 text-rose-400 font-black text-xs uppercase">
                  <Bug size={14} /> Python Error
                </div>
                <div className="text-rose-300 text-sm leading-relaxed whitespace-pre-wrap font-mono uppercase tracking-tight">
                  {error}
                </div>
              </div>
            )}
          </div>

          {output.length > 0 && !error && (
             <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-3 text-emerald-500/50">
               <CheckCircle2 size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest">Программа сәтті аяқталды</span>
             </div>
          )}
        </div>

        {/* Tip Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-xl flex flex-col justify-between overflow-hidden relative">
           <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
           <div>
            <h4 className="flex items-center gap-2 font-black mb-4 uppercase tracking-widest text-xs opacity-70">
              <AlertCircle size={16} /> Ескерту
            </h4>
            <p className="font-bold text-lg leading-relaxed mb-6">
              Бұл толыққанды Python 3.10 ортасы. Айнымалылар, циклдер және функцияларды еркін қолдана аласың!
            </p>
           </div>
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-200 bg-white/10 w-fit px-4 py-2 rounded-full">
              Real-time Interpretation
           </div>
        </div>
      </div>
    </div>
  );
}
