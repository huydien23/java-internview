import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import StudyScreen from './screens/StudyScreen';
import FlashcardScreen from './screens/FlashcardScreen';
import InterviewScreen from './screens/InterviewScreen';
import { ALL_QUESTIONS } from './constants';
import type { Question, QuestionStatus } from './types';

export type AppMode = 'home' | 'study' | 'flashcards' | 'interview';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('home');
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const savedProgress = localStorage.getItem('javaInterviewProgress');
    if (savedProgress) {
        const progressMap: Record<number, QuestionStatus> = JSON.parse(savedProgress);
        const initialQuestions = ALL_QUESTIONS.map(q => ({
            ...q,
            status: progressMap[q.id] || 'Chưa học'
        }));
        setQuestions(initialQuestions);
    } else {
        setQuestions(ALL_QUESTIONS);
    }
  }, []);
  
  const handleUpdateQuestionStatus = useCallback((questionId: number, newStatus: QuestionStatus) => {
      const updatedQuestions = questions.map(q => 
          q.id === questionId ? { ...q, status: newStatus } : q
      );
      setQuestions(updatedQuestions);

      const progressToSave = updatedQuestions.reduce((acc, q) => {
          acc[q.id] = q.status;
          return acc;
      }, {} as Record<number, QuestionStatus>);

      localStorage.setItem('javaInterviewProgress', JSON.stringify(progressToSave));
  }, [questions]);


  const handleSetMode = useCallback((newMode: AppMode) => {
    setMode(newMode);
  }, []);

  const renderContent = () => {
    switch (mode) {
      case 'study':
        return <StudyScreen questions={questions} onUpdateStatus={handleUpdateQuestionStatus} />;
      case 'flashcards':
        return <FlashcardScreen questions={questions} />;
      case 'interview':
        return <InterviewScreen />;
      case 'home':
      default:
        return <HomeScreen onSetMode={handleSetMode} questions={questions} />;
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-800 flex flex-col">
      <Header onSetMode={handleSetMode} />
      <main className="flex-grow p-4 sm:p-6 md:p-8 pt-24 max-w-7xl mx-auto w-full">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;