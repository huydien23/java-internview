import React, { useState, useMemo, useEffect } from 'react';
import { JAVA_INTERVIEW_QUESTIONS, CATEGORIES, DIFFICULTIES } from '../constants';
import type { Question, QuestionStatus, QuestionDifficulty } from '../types';
import Pagination from '../components/Pagination';

const QUESTIONS_PER_PAGE = 10;

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
const ResetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7V9a1 1 0 01-2 0V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13V11a1 1 0 112 0v6a1 1 0 01-1 1h-6a1 1 0 110-2h2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>;


interface QuestionCardProps {
    question: Question;
    index: number;
    onUpdateStatus: (questionId: number, status: QuestionStatus) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, index, onUpdateStatus }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const statusColor = {
        'Đã học': 'border-l-4 border-green-500',
        'Cần xem lại': 'border-l-4 border-yellow-500',
        'Quan trọng': 'border-l-4 border-red-500',
        'Chưa học': 'border-l-4 border-slate-300'
    };

    return (
        <div className={`bg-white rounded-lg shadow-md mb-4 overflow-hidden ${statusColor[question.status]}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left p-4 flex justify-between items-center bg-white hover:bg-slate-50 transition-colors"
            >
                <span className="font-semibold text-lg text-slate-800 pr-4">{`${index + 1}. ${question.question}`}</span>
                <div className="flex items-center space-x-2 flex-shrink-0">
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                      {question.difficulty}
                    </span>
                    <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <ChevronDownIcon />
                    </span>
                </div>
            </button>
            {isOpen && (
                <>
                    <div className="p-4 border-t border-slate-200" dangerouslySetInnerHTML={{ __html: question.answer }}>
                    </div>
                    <div className="p-2 border-t border-slate-200 bg-slate-50 flex justify-end space-x-2">
                        <button onClick={() => onUpdateStatus(question.id, 'Đã học')} title="Đánh dấu: Đã học" className="p-2 rounded-full hover:bg-green-100 text-green-600"><CheckIcon /></button>
                        <button onClick={() => onUpdateStatus(question.id, 'Cần xem lại')} title="Đánh dấu: Cần xem lại" className="p-2 rounded-full hover:bg-yellow-100 text-yellow-600"><EyeIcon /></button>
                        <button onClick={() => onUpdateStatus(question.id, 'Quan trọng')} title="Đánh dấu: Quan trọng" className="p-2 rounded-full hover:bg-red-100 text-red-600"><StarIcon /></button>
                        <button onClick={() => onUpdateStatus(question.id, 'Chưa học')} title="Reset" className="p-2 rounded-full hover:bg-slate-200 text-slate-600"><ResetIcon /></button>
                    </div>
                </>
            )}
        </div>
    );
};

interface StudyScreenProps {
    questions: Question[];
    onUpdateStatus: (questionId: number, status: QuestionStatus) => void;
}

const CategoryCard: React.FC<{category: any, onClick: () => void}> = ({ category, onClick }) => (
    <div onClick={onClick} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border-t-4 border-blue-500">
        <h3 className="text-xl font-bold text-slate-800 mb-3">{category.title}</h3>
        <div className="w-full bg-slate-200 rounded-full h-2.5 mb-1">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${category.progress}%`}}></div>
        </div>
        <p className="text-sm text-slate-500 text-right">{category.learned} / {category.total} câu</p>
    </div>
);


const StudyScreen: React.FC<StudyScreenProps> = ({ questions, onUpdateStatus }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [keyword, setKeyword] = useState('');
    const [selectedDifficulties, setSelectedDifficulties] = useState<QuestionDifficulty[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    
    const categoryStats = useMemo(() => {
        return JAVA_INTERVIEW_QUESTIONS.map(cat => {
          const categoryQuestions = questions.filter(q => q.category === cat.title);
          const learnedCount = categoryQuestions.filter(q => q.status === 'Đã học').length;
          return {
            title: cat.title,
            total: categoryQuestions.length,
            learned: learnedCount,
            progress: categoryQuestions.length > 0 ? Math.round((learnedCount / categoryQuestions.length) * 100) : 0,
          };
        });
      }, [questions]);
    
    const toggleFilter = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, value: T) => {
        setter(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
    };

    const filteredQuestions = useMemo(() => {
        if (!selectedCategory) return [];

        return questions
            .filter(q => q.category === selectedCategory)
            .filter(q => keyword === '' || q.question.toLowerCase().includes(keyword.toLowerCase()) || q.answer.toLowerCase().includes(keyword.toLowerCase()))
            .filter(q => selectedDifficulties.length === 0 || selectedDifficulties.includes(q.difficulty));
    }, [selectedCategory, keyword, selectedDifficulties, questions]);
    
    useEffect(() => {
        setCurrentPage(1);
    }, [keyword, selectedDifficulties, selectedCategory]);

    const totalPages = Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE);

    const paginatedQuestions = useMemo(() => {
        const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
        return filteredQuestions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
    }, [currentPage, filteredQuestions]);

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };


    if (!selectedCategory) {
        return (
            <div className="container mx-auto">
                 <h1 className="text-4xl font-bold text-center mb-8 text-slate-900">Học theo chủ đề</h1>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryStats.map(cat => (
                        <CategoryCard key={cat.title} category={cat} onClick={() => setSelectedCategory(cat.title)} />
                    ))}
                 </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <div className="mb-8">
                 <button onClick={() => setSelectedCategory(null)} className="flex items-center font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Quay lại danh sách chủ đề
                </button>
            </div>
            
            <h1 className="text-4xl font-bold text-center mb-8 text-slate-900">{selectedCategory}</h1>
            
            <div className="bg-white p-4 rounded-lg shadow-md mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Tìm kiếm trong chủ đề này..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg col-span-1 md:col-span-2"
                    />
                    <div>
                        <h3 className="font-semibold mb-2 text-slate-700">Độ khó</h3>
                        <div className="flex flex-wrap gap-2">
                           {DIFFICULTIES.map(d => (
                                <button key={d} onClick={() => toggleFilter(setSelectedDifficulties, d)} className={`px-3 py-1 text-sm rounded-full border-2 ${selectedDifficulties.includes(d) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-500'}`}>{d}</button>
                           ))}
                        </div>
                    </div>
                </div>
            </div>

            {filteredQuestions.length > 0 ? (
                <div>
                    <p className="text-slate-600 mb-4">Hiển thị {paginatedQuestions.length} trên tổng số {filteredQuestions.length} câu hỏi.</p>
                    {paginatedQuestions.map((q, index) => (
                        <QuestionCard key={q.id} question={q} index={(currentPage - 1) * QUESTIONS_PER_PAGE + index} onUpdateStatus={onUpdateStatus} />
                    ))}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            ) : (
                <div className="text-center text-slate-500 py-16">
                    <h3 className="text-2xl font-semibold">Không tìm thấy câu hỏi nào</h3>
                    <p className="mt-2">Vui lòng thử thay đổi hoặc xóa bớt bộ lọc.</p>
                </div>
            )}
        </div>
    );
};

export default StudyScreen;
