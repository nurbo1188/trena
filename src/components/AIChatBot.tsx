import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, X, MessageSquare, Loader2, User, Sparkles } from 'lucide-react';
import { getGeminiResponse, SYSTEM_INSTRUCTION } from '../services/geminiService';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

export default function AIChatBot({ apiKey, embedded = false }: { apiKey: string, embedded?: boolean }) {
  const [isOpen, setIsOpen] = useState(embedded);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Сәлем! Мен AlgoStep көмекшісімін. Саған қандай интеллектуалды сұрақ бар?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    if (!apiKey) {
      setMessages([...messages, { role: 'user', text: input }, { role: 'bot', text: 'Кешіріңіз, ИИ-мен сөйлесу үшін алдымен API кілтін енгізуіңіз қажет (жоғарыдағы батырма арқылы).' }]);
      setInput('');
      return;
    }

    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await getGeminiResponse(apiKey, input, SYSTEM_INSTRUCTION);
      setMessages([...newMessages, { role: 'bot', text: response }]);
    } catch (e) {
      setMessages([...newMessages, { role: 'bot', text: 'Қателік орын алды. API кілтін тексеріңіз немесе кейінірек көріңіз.' }]);
    } finally {
      setLoading(false);
    }
  };

  const ChatContent = (
    <div className={`flex flex-col bg-white overflow-hidden ${embedded ? 'h-full w-full' : 'h-[600px] w-[400px] max-w-[calc(100vw-2rem)] rounded-3xl shadow-2xl border border-slate-200'}`}>
      {/* Header */}
      {!embedded && (
        <div className="bg-slate-900 p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center animate-pulse">
              <Bot size={24} />
            </div>
            <div>
               <h3 className="font-bold flex items-center gap-2">
                 AlgoBot <Sparkles size={14} className="text-yellow-400" />
               </h3>
               <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Online</span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-lg transition">
            <X size={20} />
          </button>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                m.role === 'user' ? 'bg-slate-800 text-white' : 'bg-blue-600 text-white'
              }`}>
                {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl shadow-sm text-sm border ${
                m.role === 'user' 
                  ? 'bg-slate-800 text-white border-slate-700 rounded-tr-none' 
                  : 'bg-white text-slate-800 border-slate-100 rounded-tl-none'
              }`}>
                {m.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2 text-slate-400 text-sm">
                <Loader2 size={16} className="animate-spin" />
                Жауап дайындалуда...
             </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100 shrink-0">
         <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 shadow-inner">
            <input 
              type="text" 
              placeholder="Сұрақ қой немесе кодты тексерт..."
              className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 shadow-md"
            >
              <Send size={18} />
            </button>
         </div>
      </div>
    </div>
  );

  if (embedded) return ChatContent;

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0"
          >
            {ChatContent}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center justify-center border-4 border-white hover:bg-blue-600 transition-colors group"
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} className="group-hover:animate-bounce" />}
      </motion.button>
    </div>
  );
}
