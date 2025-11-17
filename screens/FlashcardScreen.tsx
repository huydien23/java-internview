import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { Question } from '../types';

interface FlashcardScreenProps {
  questions: Question[];
}

const FlashcardScreen: React.FC<FlashcardScreenProps> = ({ questions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if(questions.length > 0) {
      setShuffledQuestions([...questions].sort(() => Math.random() - 0.5));
    }
  }, [questions]);


  const currentQuestion = useMemo(() => shuffledQuestions[currentIndex], [currentIndex, shuffledQuestions]);

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % shuffledQuestions.length);
    }, 150);
  }, [shuffledQuestions.length]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
     setTimeout(() => {
        setCurrentIndex((prev) => (prev - 1 + shuffledQuestions.length) % shuffledQuestions.length);
     }, 150);
  }, [shuffledQuestions.length]);

  const handleShuffle = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(0);
      setShuffledQuestions([...questions].sort(() => Math.random() - 0.5));
    }, 150);
  }, [questions]);

  if (shuffledQuestions.length === 0) {
    return <div>Loading flashcards...</div>
  }

  return (
    <div className="container mx-auto max-w-3xl text-center">
      <h1 className="text-4xl font-bold mb-2 text-slate-900">Flashcards</h1>
      <p className="text-slate-600 mb-8">Click vào thẻ để xem câu trả lời. Hiện có {shuffledQuestions.length} câu hỏi.</p>
      
      <div className="perspective-1000 h-80">
        <div 
            className={`relative w-full h-full rounded-xl shadow-2xl cursor-pointer transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div className="absolute w-full h-full backface-hidden bg-white flex items-center justify-center p-6 rounded-xl border-2 border-slate-200">
                <p className="text-2xl font-semibold text-slate-800">{currentQuestion.question}</p>
            </div>
            <div className="absolute w-full h-full backface-hidden bg-blue-600 flex items-center justify-center p-6 rounded-xl rotate-y-180" dangerouslySetInnerHTML={{ __html: currentQuestion.answer }}>
            </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center items-center space-x-4">
        <button onClick={handlePrev} className="px-6 py-2 bg-white rounded-lg shadow hover:bg-slate-100 font-semibold transition">
          Câu trước
        </button>
        <span className="font-semibold text-slate-600 w-20">{currentIndex + 1} / {shuffledQuestions.length}</span>
        <button onClick={handleNext} className="px-6 py-2 bg-white rounded-lg shadow hover:bg-slate-100 font-semibold transition">
          Câu tiếp
        </button>
      </div>
      <div className="mt-4">
        <button onClick={handleShuffle} className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 font-semibold transition">
          Trộn lại
        </button>
      </div>
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default FlashcardScreen;