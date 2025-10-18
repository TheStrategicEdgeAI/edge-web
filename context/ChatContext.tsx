import { createContext, useContext, useMemo } from 'react';
import type { PhaseId } from '@/types/chat';

type PhaseConfig = {
  title: string;
  description: string;
  systemPrompt: string;
  placeholder: string;
};

type PhaseMap = Record<PhaseId, PhaseConfig>;

const phases: PhaseMap = {
  evaluate: {
    title: 'Evaluate',
    description:
      'Understand market conditions, trend types, and foundational indicators.',
    systemPrompt:
      'You are the Evaluate assistant. Provide basic market education and simple analyses (trend types, MA/RSI intros). Avoid coding.',
    placeholder: 'Ask about trend types, MAs, RSI, etc.',
  },
  design: {
    title: 'Design',
    description:
      'Co-create a rules-based strategy concept using approved indicators.',
    systemPrompt:
      'You are the Design assistant. Help the user define clear entry/exit rules using basic indicators. Avoid code—focus on rules.',
    placeholder: 'Describe the idea you want to turn into rules…',
  },
  generate: {
    title: 'Generate',
    description:
      'Turn finalized rules into code (NinjaScript / Pine), following platform standards.',
    systemPrompt:
      'You are the Generate assistant. Produce complete, functional code from finalized rules. Keep to approved indicators.',
    placeholder: 'Paste the finalized rules to generate code…',
  },
  evolve: {
    title: 'Evolve',
    description:
      'Analyze uploaded backtests, suggest optimizations, and next steps.',
    systemPrompt:
      'You are the Evolve assistant. Analyze historical results, find issues, and suggest targeted improvements.',
    placeholder: 'Paste backtest summary or metrics for analysis…',
  },
};

const ChatContext = createContext<{ phases: PhaseMap }>({ phases });

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useMemo(() => ({ phases }), []);
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const usePhases = () => useContext(ChatContext).phases;
