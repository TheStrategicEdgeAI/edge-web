import Chat from '@/components/Chat';
import { usePhases } from '@/context/ChatContext';

export default function EvaluatePage() {
  const p = usePhases().evaluate;

  return (
    <Chat
      title={`Evaluate — ${p.title}`}
      description={p.description}
      systemPrompt={p.systemPrompt}
      placeholder={p.placeholder}
      seedMessage="Welcome to Evaluate. Ask about trend types, moving averages, RSI, or basic market structure."
    />
  );
}
