import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  PlayCircle, 
  Code2, 
  GitMerge, 
  BookOpen, 
  Lightbulb,
  Terminal,
  Zap,
  CheckCircle,
  Hash,
  Brain,
  Sparkles,
  Loader2,
  Volume2,
  Bot
} from 'lucide-react';
import { THEORY_TOPICS } from '../constants';
import { getGeminiResponse, SYSTEM_INSTRUCTION } from '../services/geminiService';

interface Props {
  apiKey: string;
}

export default function TheorySection({ apiKey }: Props) {
  const [selectedTopic, setSelectedTopic] = useState(THEORY_TOPICS[0]);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getAiInsight = async (mode: 'simple' | 'analogy') => {
    if (!apiKey) return;
    setLoading(true);
    try {
      const prompt = mode === 'simple' 
        ? `"${selectedTopic.title}" тақырыбын 6-сынып баласына өте қарапайым тілмен түсіндіріп берші.`
        : `"${selectedTopic.title}" тақырыбына өмірден қызықты аналогия (мысал) келтірші.`;
      const resp = await getGeminiResponse(apiKey, prompt, SYSTEM_INSTRUCTION);
      setAiInsight(resp);
    } catch {
      setAiInsight("Қателік орын алды.");
    } finally {
      setLoading(false);
    }
  };

  const handleTopicChange = (topic: typeof selectedTopic) => {
    setSelectedTopic(topic);
    setAiInsight(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar - Topics List */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <BookOpen className="text-blue-600" />
              Болімдер
            </h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">Негізгі тақырыптар</p>
          </div>
          <div className="p-2 space-y-1">
            {THEORY_TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleTopicChange(topic)}
                className={`w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between group ${
                  selectedTopic.id === topic.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                }`}
              >
                <div className="flex items-center gap-3">
                   <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${
                     selectedTopic.id === topic.id ? 'bg-white/20' : 'bg-slate-100'
                   }`}>
                      {THEORY_TOPICS.indexOf(topic) + 1}
                   </div>
                   <span className="font-bold">{topic.title}</span>
                </div>
                <ChevronRight size={18} className={`transition-transform duration-300 ${selectedTopic.id === topic.id ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <h4 className="flex items-center gap-2 font-bold mb-4">
             <Lightbulb className="text-yellow-300" />
             Кеңес
          </h4>
          <p className="text-sm text-blue-100 leading-relaxed font-medium">
             Теорияны оқып болған соң, алған біліміңді ТЕСТ бөлімінде тексеруді ұмытпа!
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="lg:col-span-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTopic.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-sm min-h-[600px] flex flex-col"
          >
            <div className="mb-8">
               <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-[0.2em] mb-4">
                  <Zap size={14} /> Түсіндірме
               </div>
               <h1 className="text-4xl font-black text-slate-900 mb-6 leading-tight">{selectedTopic.title}</h1>
               <div className="h-1.5 w-24 bg-blue-600 rounded-full mb-10" />
            </div>
            
            <div className="prose prose-slate max-w-none flex-1">
              <p className="text-xl leading-relaxed text-slate-600 font-medium">
                {selectedTopic.content}
              </p>

              {apiKey && (
                <div className="mt-8 space-y-4">
                  <div className="flex gap-3">
                    <button 
                      onClick={() => getAiInsight('simple')}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-100 transition disabled:opacity-50"
                    >
                      {loading ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} />} Оңай тілмен түсіндіру
                    </button>
                    <button 
                      onClick={() => getAiInsight('analogy')}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold hover:bg-indigo-100 transition disabled:opacity-50"
                    >
                      {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} Өмірден мысал
                    </button>
                  </div>

                  <AnimatePresence>
                    {aiInsight && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-3xl border border-blue-100 shadow-inner relative"
                      >
                         <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">
                           <Bot size={14} /> AI Көмекші
                         </div>
                         <p className="text-blue-900 leading-relaxed italic">{aiInsight}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div className="mt-12 space-y-8">
              <section className="bg-slate-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Terminal size={64} className="text-white" /></div>
                <h3 className="flex items-center gap-2 font-black text-white mb-6 text-lg tracking-wide uppercase">
                  <Code2 className="text-emerald-400" />
                  Код мысалы
                </h3>
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 font-mono text-emerald-400 text-lg leading-relaxed shadow-inner">
                  <pre className="whitespace-pre-wrap">{selectedTopic.example}</pre>
                </div>
              </section>

              {selectedTopic.flowchart && (
                <section className="bg-blue-50 rounded-3xl p-8 border border-blue-100">
                  <h3 className="flex items-center gap-2 font-black text-blue-900 mb-6 text-lg tracking-wide uppercase">
                    <GitMerge className="text-blue-500" />
                    Блок-схема логикасы
                  </h3>
                  <div className="flex flex-wrap items-center justify-center gap-4 bg-white p-8 rounded-2xl border border-blue-200 font-mono text-sm shadow-sm">
                    {selectedTopic.flowchart.split(' -> ').map((step, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className={`px-5 py-2 rounded-lg font-bold border-2 ${
                          step.startsWith('[') ? 'bg-orange-50 border-orange-200 text-orange-700' :
                          step.startsWith('<') ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                          'bg-blue-50 border-blue-200 text-blue-700'
                        }`}>
                          {step.replace(/[\[\]<>]/g, '')}
                        </div>
                        {i < selectedTopic.flowchart!.split(' -> ').length - 1 && (
                          <ChevronRight size={20} className="text-slate-300" />
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100">
                  <CheckCircle size={20} className="shrink-0 mt-1" />
                  <p className="text-sm font-bold leading-relaxed">Осы тақырыпты түсіндің бе? Жарайсың!</p>
               </div>
               <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50 text-blue-800 border border-blue-100">
                  <Hash size={20} className="shrink-0 mt-1" />
                  <p className="text-sm font-bold leading-relaxed">Тақырып №{THEORY_TOPICS.indexOf(selectedTopic) + 1}</p>
               </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
