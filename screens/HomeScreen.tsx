import React, { useMemo } from 'react';
import type { AppMode } from '../App';
import type { Question } from '../types';

interface HomeScreenProps {
  onSetMode: (mode: AppMode) => void;
  questions: Question[];
}

const ProgressSummary: React.FC<{ questions: Question[] }> = ({ questions }) => {
    const stats = useMemo(() => {
        if (!questions.length) {
            return { learned: 0, toReview: 0, important: 0, percent: 0 };
        }
        const learned = questions.filter(q => q.status === 'Đã học').length;
        const toReview = questions.filter(q => q.status === 'Cần xem lại').length;
        const important = questions.filter(q => q.status === 'Quan trọng').length;
        const percent = Math.round((learned / questions.length) * 100);
        return { learned, toReview, important, percent };
    }, [questions]);

    return (
        <div className="mb-12 bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Tổng quan tiến độ</h2>
            <div className="w-full bg-slate-200 rounded-full h-4 mb-2">
                <div 
                    className="bg-blue-600 h-4 rounded-full transition-all duration-500" 
                    style={{ width: `${stats.percent}%` }}
                ></div>
            </div>
            <p className="text-right font-semibold text-blue-700">{stats.percent}% Đã học ({stats.learned}/{questions.length})</p>
            <div className="mt-4 flex justify-around text-center">
                <div>
                    <p className="text-2xl font-bold text-green-600">{stats.learned}</p>
                    <p className="text-sm text-slate-500">Đã học</p>
                </div>
                <div>
                    <p className="text-2xl font-bold text-yellow-600">{stats.toReview}</p>
                    <p className="text-sm text-slate-500">Cần xem lại</p>
                </div>
                <div>
                    <p className="text-2xl font-bold text-red-600">{stats.important}</p>
                    <p className="text-sm text-slate-500">Quan trọng</p>
                </div>
            </div>
        </div>
    );
};

// Fix: Replaced JSX.Element with React.ReactNode to resolve "Cannot find namespace 'JSX'" error.
const ModeCard: React.FC<{ title: string; description: string; onClick: () => void; icon: React.ReactNode }> = ({ title, description, onClick, icon }) => (
    <div
        onClick={onClick}
        className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col items-center text-center h-full"
    >
        <div className="text-blue-600 mb-4">{icon}</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-slate-600">{description}</p>
    </div>
);

const BookOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);
const LayersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);
const MicIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12-9l-2.635 4.391a6.023 6.023 0 01-1.135 1.844m-1.135-1.844a6.023 6.023 0 00-1.135 1.844m-1.135-1.844l-2.635-4.391m12 0l.007-.011a6.024 6.024 0 00-1.142-1.833m-10.714 1.844a6.024 6.024 0 01-1.142-1.833M12 18.75v-1.5m0 0a6.003 6.003 0 004.47-2.032m-8.94 2.032a6.003 6.003 0 014.47-2.032" />
    </svg>
);


const HomeScreen: React.FC<HomeScreenProps> = ({ onSetMode, questions }) => {
  return (
    <div className="container mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-slate-900">Trở thành Chuyên gia Java</h1>
            <p className="text-xl text-slate-600 mt-4">
                Luyện tập với các câu hỏi phỏng vấn thực tế, ôn tập với flashcards, và thử sức với bài phỏng vấn được chấm điểm bởi AI.
            </p>
        </div>
        
        <ProgressSummary questions={questions} />

        <div className="grid md:grid-cols-3 gap-8">
            <ModeCard
                title="Học lý thuyết"
                description="Xem lại toàn bộ câu hỏi và câu trả lời theo từng chủ đề để nắm vững kiến thức nền tảng."
                onClick={() => onSetMode('study')}
                icon={<BookOpenIcon />}
            />
            <ModeCard
                title="Luyện tập Flashcards"
                description="Kiểm tra nhanh kiến thức của bạn. Lật thẻ để xem câu trả lời và ghi nhớ hiệu quả hơn."
                onClick={() => onSetMode('flashcards')}
                icon={<LayersIcon />}
            />
            <ModeCard
                title="Phỏng vấn thử với AI"
                description="Trải nghiệm phỏng vấn mô phỏng với 10 câu hỏi ngẫu nhiên và nhận điểm số, phân tích chi tiết từ AI."
                onClick={() => onSetMode('interview')}
                icon={<MicIcon />}
            />
        </div>
    </div>
  );
};

export default HomeScreen;