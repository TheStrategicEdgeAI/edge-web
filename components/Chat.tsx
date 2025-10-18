import { useState } from 'react';
import type { Message } from '@/types/chat';

type Props = {
  title: string;
  description: string;
  systemPrompt: string;
  placeholder?: string;
  seedMessage?: string; // optional welcome line
  apiPath?: string;     // override if needed
};

export default function Chat({
  title,
  description,
  systemPrompt,
  placeholder = 'Type your message…',
  seedMessage = 'Hi! How can I help?',
  apiPath = '/api/chat',
}: Props) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: seedMessage },
  ]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: input };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          messages: next,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = (await res.json()) as { reply: string };
      const assistantMsg: Message = { role: 'assistant', content: data.reply };
      setMessages([...next, assistantMsg]);
    } catch (err: any) {
      const assistantMsg: Message = {
        role: 'assistant',
        content:
          'Sorry—something went wrong. Please try again or check your API route.',
      };
      setMessages([...next, assistantMsg]);
    } finally {
      setLoading(false);
    }
  };

  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px' }}>
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 28, margin: 0 }}>{title}</h1>
        <p style={{ color: '#666', marginTop: 8 }}>{description}</p>
      </header>

      <section
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: 16,
          minHeight: 360,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          background: '#fff',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                background: m.role === 'user' ? '#e5f0ff' : '#f6f6f6',
                border: '1px solid #e5e7eb',
                padding: '10px 12px',
                borderRadius: 10,
                maxWidth: '80%',
                whiteSpace: 'pre-wrap',
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: '#888',
                  marginBottom: 4,
                  textTransform: 'uppercase',
                }}
              >
                {m.role}
              </div>
              <div>{m.content}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            gap: 8,
            marginTop: 'auto',
            borderTop: '1px solid #eee',
            paddingTop: 12,
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onEnter}
            placeholder={placeholder}
            style={{ 
              flex: 1, 
              padding: '10px 12px', 
              border: '1px solid #e5e7eb', 
              borderRadius: 8, 
              outline: 'none' 
            }}
          />
          <button
            onClick={send}
            disabled={loading}
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid #111827',
              background: loading ? '#9ca3af' : '#111827',
              color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Thinking…' : 'Send'}
          </button>
        </div>
      </section>
    </div>
  );
}
