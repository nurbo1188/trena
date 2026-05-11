import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  RotateCcw, 
  Trophy,
  Bot,
  Sparkles,
  Loader2
} from 'lucide-react';
import { TEST_QUESTIONS } from '../constants';
import { getGeminiResponse, SYSTEM_INSTRUCTION } from '../services/geminiService';

interface Props {
  apiKey: string;
  onFinish: (score: number) => void;
}

export default function TestSection({ onFinish, apiKey }: Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const question = TEST_QUESTIONS[currentQuestionIndex];

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === question.correctAnswer) {
      setScore(s => s + 1);
    } else {
      setWrongAnswers(w => [...w, question.id]);
    }
  };

  const nextQuestion = () => {
    setAiExplanation(null);
    if (currentQuestionIndex < TEST_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      onFinish(score);
    }
  };

  const askAI = async () => {
    if (!apiKey) return;
    setAiLoading(true);
    try {
      const prompt = `Сұрақ: ${question.text}. Дұрыс жауап: ${question.options[question.correctAnswer]}. Менің таңдауым: ${question.options[selectedOption!]}. Осы жауаптың неге дұрыс/қате екенін оқушыға (6-сынып) тереңірек түсіндіріп берш.`;
      const response = await getGeminiResponse(apiKey, prompt, SYSTEM_INSTRUCTION);
      setAiExplanation(response);
    } catch {
      setAiExplanation("Қателік орын алды.");
    } finally {
      setAiLoading(false);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowResult(false);
    setWrongAnswers([]);
  };

  if (showResult) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto bg-white rounded-3xl p-10 shadow-xl text-center border border-slate-200"
      >
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600">
          <Trophy size={48} />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Тест аяқталды!</h2>
        <p className="text-slate-500 mb-8 text-lg">Сен {TEST_QUESTIONS.length} сұрақтан {score} ұпай жинадың</p>
        
        <div className="text-6xl font-black text-blue-600 mb-10">
          {Math.round((score / TEST_QUESTIONS.length) * 100)}%
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
            <div className="text-2xl font-bold text-emerald-700">{score}</div>
            <div className="text-sm text-emerald-600">Дұрыс</div>
          </div>
          <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
            <div className="text-2xl font-bold text-rose-700">{TEST_QUESTIONS.length - score}</div>
            <div className="text-sm text-rose-600">Қате</div>
          </div>
        </div>

        <button
          onClick={restartQuiz}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all text-lg"
        >
          <RotateCcw size={20} />
          Қайта бастау
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-xs">
            Сұрақ {currentQuestionIndex + 1} / {TEST_QUESTIONS.length}
          </span>
          <span className="text-blue-600 font-black text-lg">
            {Math.round(((currentQuestionIndex + 1) / TEST_QUESTIONS.length) * 100)}%
          </span>
        </div>
        <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-blue-600"
            animate={{ width: `${((currentQuestionIndex + 1) / TEST_QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200"
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-8 leading-snug">
            {question.text}
          </h2>

          <div className="space-y-4">
            {question.options.map((option, index) => {
              let status = 'default';
              if (isAnswered) {
                if (index === question.correctAnswer) status = 'correct';
                else if (index === selectedOption) status = 'incorrect';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={isAnswered}
                  className={`w-full text-left p-5 rounded-2xl flex items-center justify-between transition-all border-2 ${
                    status === 'default' 
                      ? 'bg-slate-50 border-slate-100 hover:border-blue-300 hover:bg-white text-slate-700'
                      : status === 'correct'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                      : 'bg-rose-50 border-rose-500 text-rose-800'
                  }`}
                >
                  <span className="text-lg">{option}</span>
                  {status === 'correct' && <CheckCircle2 className="text-emerald-500 shrink-0" />}
                  {status === 'incorrect' && <XCircle className="text-rose-500 shrink-0" />}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-8 pt-8 border-t border-slate-100"
              >
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl mb-6 flex flex-col gap-4">
                  <p className="text-blue-800 font-medium leading-relaxed italic">
                    💡 {question.explanation}
                  </p>
                  {apiKey && !aiExplanation && (
                    <button 
                      onClick={askAI}
                      disabled={aiLoading}
                      className="flex items-center gap-2 text-xs font-black text-blue-600 hover:text-blue-800 transition"
                    >
                      {aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Bot size={14} />} AI-ДАН ТОЛЫҒЫРАҚ СҰРАУ
                    </button>
                  )}
                  {aiExplanation && (
                    <div className="pt-4 border-t border-blue-200 text-sm text-blue-900 animate-in fade-in slide-in-from-top-2">
                       <div className="flex items-center gap-2 mb-2 font-black text-[10px] tracking-widest text-blue-500 uppercase">
                          <Sparkles size={12} /> AI Түсіндірмесі
                       </div>
                       {aiExplanation}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={nextQuestion}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all text-lg group"
                >
                  {currentQuestionIndex === TEST_QUESTIONS.length - 1 ? 'Нәтижені көру' : 'Келесі сұрақ'}
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
