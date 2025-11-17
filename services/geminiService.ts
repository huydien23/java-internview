
import { GoogleGenAI, Type } from "@google/genai";
import type { AIFeedback, InterviewAnswer } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        score: {
            type: Type.NUMBER,
            description: "A score from 1 to 10 evaluating the user's answer."
        },
        feedback: {
            type: Type.OBJECT,
            properties: {
                strengths: {
                    type: Type.STRING,
                    description: "Positive feedback on what the user answered correctly."
                },
                improvements: {
                    type: Type.STRING,
                    description: "Constructive feedback on how the user could improve their answer."
                }
            },
            required: ["strengths", "improvements"]
        }
    },
    required: ["score", "feedback"]
};

export const evaluateAnswer = async (interviewAnswer: InterviewAnswer): Promise<AIFeedback> => {
  const { question, userAnswer } = interviewAnswer;

  const prompt = `
    You are a world-class senior Java engineer conducting a technical interview. Your task is to evaluate a candidate's answer to a specific interview question.

    Here is the information you'll use:
    - **Interview Question:** "${question.question}"
    - **Suggested Answer / Key Points:** "${question.answer}"
    - **Candidate's Answer:** "${userAnswer}"

    Please perform the following steps:
    1.  **Analyze:** Compare the candidate's answer to the suggested answer and your expert knowledge. Assess its technical accuracy, completeness, and clarity.
    2.  **Score:** Provide a score from 1 to 10, where 1 is completely wrong and 10 is a perfect, comprehensive answer.
    3.  **Feedback:** Write constructive feedback in Vietnamese. First, point out what the candidate got right ('Điểm mạnh'). Then, clearly explain any inaccuracies, omissions, or areas for improvement ('Góp ý cải thiện'). Provide a corrected or more ideal version of the answer if necessary.

    Your response must be a JSON object that conforms to the provided schema. Do not include any text outside of the JSON object.
  `;
  
  try {
     const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        }
     });
    
    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    return parsedJson as AIFeedback;
  } catch (error) {
    console.error("Error evaluating answer with Gemini:", error);
    // Return a default error feedback object
    return {
      score: 0,
      feedback: {
        strengths: "Không thể nhận được phản hồi từ AI.",
        improvements: "Đã xảy ra lỗi khi xử lý câu trả lời của bạn. Vui lòng thử lại. Lỗi có thể do chính sách an toàn của API."
      }
    };
  }
};
   