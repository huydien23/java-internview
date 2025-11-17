export type QuestionStatus = 'Chưa học' | 'Đã học' | 'Cần xem lại' | 'Quan trọng';
export type QuestionDifficulty = 'Dễ' | 'Trung bình' | 'Khó';


export interface Question {
  id: number;
  question: string;
  answer: string;
  difficulty: QuestionDifficulty;
  status: QuestionStatus;
  // FIX: Add category property to align with data structure and fix type errors.
  category: string;
}

export interface QuestionCategory {
  title: string;
  questions: Question[];
}

export interface AIFeedback {
  score: number;
  feedback: {
    strengths: string;
    improvements: string;
  };
}

export interface InterviewAnswer {
  question: Question;
  userAnswer: string;
}

export interface InterviewResult extends InterviewAnswer {
  feedback: AIFeedback | null;
}