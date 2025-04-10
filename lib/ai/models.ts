export const INTERNET_CHAT_MODEL: string = 'chat-model-large';
export const PRIVATE_CHAT_MODEL: string = 'chat-model-small';

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model-large',
    name: 'AiirHub Model',
    description: 'AI model for complex, multi-step tasks. Can browser Internet and cite sources',
  },
];
