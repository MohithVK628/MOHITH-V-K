
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getChatResponse, resetChat } from '../services/geminiService';
import { ChatMessage, Language, MessageSender } from '../types';
import { SAMPLE_PROMPTS } from '../constants';
import { SendIcon } from './IconComponents';

interface ChatbotProps {
    askAboutMilestone: string;
    setAskAboutMilestone: (prompt: string) => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({ askAboutMilestone, setAskAboutMilestone }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    resetChat(language);
    setMessages([]);
    const welcomeMessage = language === Language.ENGLISH 
      ? "Hello! I'm your guide to Kannada Cinema history. How can I help you today?"
      : "ನಮಸ್ಕಾರ! ನಾನು ಕನ್ನಡ ಚಿತ್ರರಂಗದ ಇತಿಹಾಸದ ಕುರಿತು ನಿಮ್ಮ ಮಾರ್ಗದರ್ಶಕ. ನಾನು ನಿಮಗೆ ಇಂದು ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?";
    setMessages([{ sender: MessageSender.BOT, text: welcomeMessage }]);
  }, [language]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const newMessages: ChatMessage[] = [
      ...messages,
      { sender: MessageSender.USER, text: messageText },
    ];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      const botResponse = await getChatResponse(newMessages, messageText, language);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: MessageSender.BOT, text: botResponse },
      ]);
    } catch (error) {
      console.error(error);
      const errorMessage = language === Language.ENGLISH 
        ? "I seem to be having trouble connecting. Please try again later."
        : "ಸಂಪರ್ಕದಲ್ಲಿ ದೋಷ ಕಂಡುಬಂದಿದೆ. ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.";
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: MessageSender.BOT, text: errorMessage },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, language]);

  useEffect(() => {
    if (askAboutMilestone) {
        handleSendMessage(askAboutMilestone);
        setAskAboutMilestone('');
    }
  }, [askAboutMilestone, handleSendMessage, setAskAboutMilestone]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(userInput);
  };
  
  return (
    <div className="flex flex-col h-full bg-gray-900 border border-yellow-500/30 rounded-lg shadow-2xl shadow-yellow-500/10">
      <div className="p-4 border-b border-yellow-500/30 flex justify-between items-center">
        <h2 className="text-xl font-serif text-yellow-400">Sandalwood Saga Bot</h2>
        <div className="flex items-center bg-gray-800 border border-yellow-500/50 rounded-full">
            <button onClick={() => setLanguage(Language.ENGLISH)} className={`px-3 py-1 text-sm rounded-full transition-colors ${language === Language.ENGLISH ? 'bg-yellow-500 text-black' : 'text-yellow-400'}`}>EN</button>
            <button onClick={() => setLanguage(Language.KANNADA)} className={`px-3 py-1 text-sm rounded-full transition-colors ${language === Language.KANNADA ? 'bg-yellow-500 text-black' : 'text-yellow-400'}`}>ಕ</button>
        </div>
      </div>
      <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === MessageSender.USER ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${msg.sender === MessageSender.USER ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-white'}`}>
              <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg bg-gray-800 text-white flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
            </div>
        )}
      </div>
      <div className="p-4 border-t border-yellow-500/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
            {SAMPLE_PROMPTS[language === Language.ENGLISH ? 'en' : 'kn'].map((prompt) => (
                <button 
                    key={prompt}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-xs text-center p-2 bg-gray-800 text-yellow-300 rounded-md hover:bg-yellow-500 hover:text-black transition-colors truncate"
                >
                    {prompt}
                </button>
            ))}
        </div>
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={language === Language.ENGLISH ? "Ask about Kannada cinema..." : "ಕನ್ನಡ ಚಿತ್ರರಂಗದ ಬಗ್ಗೆ ಕೇಳಿ..."}
            className="flex-grow bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button type="submit" disabled={isLoading} className="bg-yellow-500 text-black p-2 rounded-lg hover:bg-yellow-400 disabled:bg-gray-600 transition-colors">
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};
