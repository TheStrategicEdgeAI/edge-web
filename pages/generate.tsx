import Chat from '@/components/Chat';
import { usePhases } from '@/context/ChatContext';

export default function GeneratePage() {
  const p = usePhases().generate;

  return (
    <Chat
      title={`Generate — ${p.title}`}
      description={p.description}
      systemPrompt={p.systemPrompt}
      placeholder={p.placeholder}
      seedMessage="Paste finalized rules, then choose target (e.g., NinjaScript). I’ll output complete, formatted code."
    />
  );
}
