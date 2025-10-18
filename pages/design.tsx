import Chat from '@/components/Chat';
import { usePhases } from '@/context/ChatContext';

export default function DesignPage() {
  const p = usePhases().design;

  return (
    <Chat
      title={`Design — ${p.title}`}
      description={p.description}
      systemPrompt={p.systemPrompt}
      placeholder={p.placeholder}
      seedMessage="Describe your idea and we’ll convert it into clear, rules-based logic (no code here—just rules)."
    />
  );
}
