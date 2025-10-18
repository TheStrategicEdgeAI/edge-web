// Shared chat types

export type ChatRole = 'user' | 'assistant';

export type Message = {
  role: ChatRole;
  content: string;
  id?: string;
  createdAt?: string;
};

export type PhaseId = 'evaluate' | 'design' | 'generate' | 'evolve';
