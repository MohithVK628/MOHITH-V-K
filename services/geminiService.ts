import { GoogleGenAI, Content } from "@google/genai";
import { ChatMessage, Language, MessageSender } from '../types';

let ai: GoogleGenAI | null = null;

const getAi = () => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

const buildHistory = (history: ChatMessage[]): Content[] => {
    return history.map(msg => ({
        role: msg.sender === MessageSender.USER ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));
};

export const getChatResponse = async (
    history: ChatMessage[], 
    newMessage: string, 
    language: Language
): Promise<string> => {
    try {
        const aiInstance = getAi();
        const systemInstruction = `You are a friendly and knowledgeable expert on the history of Kannada cinema, also known as Sandalwood. Your goal is to provide informative and engaging answers to user questions about milestones, actors, directors, films, and trends in Kannada cinema history. Respond exclusively in ${language}. Be concise and clear.`;

        const contents = buildHistory(history);

        const response = await aiInstance.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                systemInstruction,
            },
        });
        
        return response.text;

    } catch (error) {
        console.error("Error getting chat response:", error);
        if (language === Language.KANNADA) {
            return "ಕ್ಷಮಿಸಿ, ದೋಷವೊಂದು ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.";
        }
        return "Sorry, an error occurred. Please try again.";
    }
};

// The chat is now stateless, so this function is a no-op but kept to avoid breaking component calls.
export const resetChat = (language: Language) => {
    // No action needed for stateless chat.
};
