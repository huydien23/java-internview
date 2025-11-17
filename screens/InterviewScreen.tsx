import React, { useState, useCallback, useMemo } from 'react';
import { ALL_QUESTIONS, INTERVIEW_QUESTION_COUNT } from '../constants';
import { evaluateAnswer } from '../services/geminiService';
import type { Question, InterviewResult, AIFeedback } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const InterviewScreen: React.FC = () => {
    type InterviewState = 'not_started' | 'in_progress' | 'evaluating' | 'results';

    const [interviewState, setInterviewState] = useState<InterviewState>('not_started');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [results, setResults] = useState<InterviewResult[]>([]);
    const [hintsRevealed, setHintsRevealed] = useState<Record<number, boolean>>({});
    const [isHintVisible, setIsHintVisible] = useState(false);

    const startInterview = useCallback(() => {
        const shuffled = [...ALL_QUESTIONS].sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffled.slice(0, INTERVIEW_QUESTION_COUNT);
        setQuestions(selectedQuestions);
        setAnswers({});
        setCurrentQuestionIndex(0);
        setResults([]);
        setInterviewState('in_progress');
        setHintsRevealed({});
        setIsHintVisible(false);
    }, []);

    const handleAnswerChange = (questionId: number, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const submitInterview = useCallback(async () => {
        setInterviewState('evaluating');
        const submittedAnswers = questions.map(q => ({
            question: q,
            userAnswer: answers[q.id] || "Không có câu trả lời.",
        }));

        const evaluationPromises = submittedAnswers.map(ans => evaluateAnswer(ans));
        const evaluatedFeedbacks = await Promise.all(evaluationPromises);

        const finalResults = submittedAnswers.map((ans, index) => ({
            ...ans,
            feedback: evaluatedFeedbacks[index]
        }));
        
        setResults(finalResults);
        setInterviewState('results');
    }, [questions, answers]);
    
    const averageScore = useMemo(() => {
        if (results.length === 0) return 0;
        const totalScore = results.reduce((sum, result) => sum + (result.feedback?.score || 0), 0);
        return (totalScore / results.length).toFixed(1);
    }, [results]);

    const handleNavigation = (newIndex: number) => {
        if (newIndex >= 0 && newIndex < questions.length) {
            setCurrentQuestionIndex(newIndex);
            setIsHintVisible(false);
        }
    };

    const toggleHint = (questionId: number) => {
        if (!isHintVisible) {
            setHintsRevealed(prev => ({...prev, [questionId]: true}));
        }
        setIsHintVisible(!isHintVisible);
    };

    if (interviewState === 'not_started') {
        return (
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4 text-slate-900">Phỏng vấn thử với AI</h1>
                <p className="text-lg text-slate-600 mb-8">
                    Bạn sẽ nhận được {INTERVIEW_QUESTION_COUNT} câu hỏi ngẫu nhiên. Hãy trả lời một cách chi tiết. Sau khi hoàn thành, AI sẽ chấm điểm và đưa ra nhận xét cho từng câu trả lời của bạn.
                </p>
                <button
                    onClick={startInterview}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-transform duration-200 hover:scale-105"
                >
                    Bắt đầu phỏng vấn
                </button>
            </div>
        );
    }
    
    if (interviewState === 'evaluating') {
        return (
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4 text-slate-900">AI đang phân tích câu trả lời của bạn...</h1>
                <p className="text-slate-600 mb-8">Quá trình này có thể mất một vài giây. Vui lòng chờ.</p>
                <LoadingSpinner />
            </div>
        );
    }
    
    if (interviewState === 'results') {
        return (
            <div>
                <h1 className="text-4xl font-bold text-center mb-4 text-slate-900">Kết quả phỏng vấn</h1>
                 <div className="text-center mb-8 bg-white p-6 rounded-xl shadow-lg max-w-sm mx-auto">
                    <h2 className="text-2xl font-bold text-slate-800">Điểm trung bình</h2>
                    <p className={`text-6xl font-extrabold mt-2 ${Number(averageScore) >= 7 ? 'text-green-600' : Number(averageScore) >= 4 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {averageScore} / 10
                    </p>
                </div>
                {results.map((result, index) => (
                    <div key={result.question.id} className="bg-white p-6 rounded-xl shadow-lg mb-6">
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold text-slate-800 mb-2 pr-4">{index + 1}. {result.question.question}</h3>
                            {hintsRevealed[result.question.id] && (
                                <span className="flex-shrink-0 text-xs font-semibold inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800" title="Bạn đã xem gợi ý cho câu này">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 2a1 1 0 011 1 7 7 0 017 7 1 1 0 11-2 0 5 5 0 00-5-5 1 1 0 01-1-1zM2 10a1 1 0 011-1 7 7 0 017 7 1 1 0 11-2 0 5 5 0 00-5-5 1 1 0 01-1-1z"></path>
                                        <path d="M10 6a4 4 0 100 8 4 4 0 000-8zM8.5 9.5a.5.5 0 000 1h3a.5.5 0 000-1h-3z"></path>
                                    </svg>
                                    Đã xem gợi ý
                                </span>
                            )}
                        </div>

                        <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                           <h4 className="font-semibold text-slate-600 mb-2">Câu trả lời của bạn:</h4>
                           <p className="text-slate-700 whitespace-pre-wrap">{result.userAnswer}</p>
                        </div>
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                           <h4 className="font-semibold text-blue-800 mb-2">Phản hồi từ AI (Điểm: {result.feedback?.score}/10):</h4>
                           <div className="mt-2">
                                <p className="font-semibold text-green-700">Điểm mạnh:</p>
                                <p className="text-slate-700 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: result.feedback?.feedback.strengths || ''}}></p>
                           </div>
                           <div className="mt-3">
                                <p className="font-semibold text-orange-700">Góp ý cải thiện:</p>
                                <p className="text-slate-700 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: result.feedback?.feedback.improvements || ''}}></p>
                           </div>
                        </div>
                    </div>
                ))}
                <div className="text-center mt-8">
                     <button
                        onClick={startInterview}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-transform duration-200 hover:scale-105"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }
    
    // In progress
    const currentQuestion = questions[currentQuestionIndex];
    return (
         <div>
             <h1 className="text-3xl font-bold text-center mb-6 text-slate-900">Câu hỏi {currentQuestionIndex + 1} / {questions.length}</h1>
             <div className="bg-white p-8 rounded-xl shadow-lg">
                <p className="text-xl font-semibold text-slate-800 mb-4">{currentQuestion.question}</p>
                <textarea
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    rows={10}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Nhập câu trả lời của bạn ở đây..."
                />
                <div className="mt-4">
                    <button
                        onClick={() => toggleHint(currentQuestion.id)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                           <path d="M10 2a1 1 0 011 1 7 7 0 017 7 1 1 0 11-2 0 5 5 0 00-5-5 1 1 0 01-1-1zM2 10a1 1 0 011-1 7 7 0 017 7 1 1 0 11-2 0 5 5 0 00-5-5 1 1 0 01-1-1z"></path>
                           <path d="M10 6a4 4 0 100 8 4 4 0 000-8zM8.5 9.5a.5.5 0 000 1h3a.5.5 0 000-1h-3z"></path>
                        </svg>
                        {isHintVisible ? 'Ẩn gợi ý' : 'Xem gợi ý đáp án'}
                    </button>
                    {isHintVisible && (
                        <div className="mt-2 p-4 bg-amber-50 border border-amber-200 rounded-lg animate-fade-in">
                            <h4 className="font-bold text-amber-800">Đáp án tham khảo:</h4>
                            <div className="text-slate-700" dangerouslySetInnerHTML={{ __html: currentQuestion.answer }}></div>
                        </div>
                    )}
                </div>
             </div>
             <div className="mt-6 flex justify-between items-center">
                 <button
                    onClick={() => handleNavigation(currentQuestionIndex - 1)}
                    disabled={currentQuestionIndex === 0}
                    className="px-6 py-2 bg-white rounded-lg shadow hover:bg-slate-100 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Trước
                </button>
                {currentQuestionIndex === questions.length - 1 ? (
                     <button
                        onClick={submitInterview}
                        className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-transform duration-200 hover:scale-105"
                    >
                        Hoàn thành & Chấm điểm
                    </button>
                ) : (
                    <button
                        onClick={() => handleNavigation(currentQuestionIndex + 1)}
                        disabled={currentQuestionIndex === questions.length - 1}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 font-semibold disabled:opacity-50"
                    >
                        Tiếp theo
                    </button>
                )}
             </div>
         </div>
    );
};

export default InterviewScreen;