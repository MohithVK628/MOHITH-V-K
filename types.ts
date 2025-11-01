
export interface Milestone {
  year: number;
  title: string;
  description: {
    en: string;
    kn: string;
  };
  imageUrl: string;
}

export enum MessageSender {
  USER = 'user',
  BOT = 'bot',
}

export interface ChatMessage {
  sender: MessageSender;
  text: string;
}

export enum Language {
  ENGLISH = 'English',
  KANNADA = 'Kannada',
}
