import { GoogleGenerativeAI } from '@google/generative-ai'
import type { ChatMessage } from '@/types'

let genAIInstance = null;

const getGenAIInstance = (apiKey) => {
  if (!genAIInstance) {
    genAIInstance = new GoogleGenerativeAI(apiKey);
  }
  return genAIInstance;
};

export const startChatAndSendMessageStream = async(history: ChatMessage[], newMessage: string,key:string) => {
  const genAI = getGenAIInstance(key)
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const chat = model.startChat({
    history: history.map(msg => ({
      role: msg.role,
      parts: msg.parts.map(part => part.text).join(''), // Join parts into a single string
    })),
    generationConfig: {
      maxOutputTokens: 8000,
    },
  })

  // Use sendMessageStream for streaming responses
  const result = await chat.sendMessageStream(newMessage)
  return result.stream
}
