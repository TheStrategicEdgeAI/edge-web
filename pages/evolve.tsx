import Chat from '@/components/Chat';
import { usePhases } from '@/context/ChatContext';

export default function EvolvePage() {
  const p = usePhases().evolve;

  return (
    <Chat
      title={`Evolve — ${p.title}`}
      description={p.description}
      systemPrompt={p.systemPrompt}
      placeholder={p.placeholder}
      seedMessage="Upload a backtest summary or paste metrics; I’ll diagnose and propose targeted improvements."
    />
  );
}
