import { useState } from 'react';
import Link from 'next/link';

/**
 * Evaluate page
 *
 * This simple implementation demonstrates a chat input and a static assistant response.
 * In production you would call your API to send messages and stream results,
 * as well as display lesson suggestions and glossary information on the right.
 */
export default function Evaluate() {
  // Define a message type so TypeScript preserves literal string unions for the role.
  type ChatMessage = { role: 'user' | 'assistant'; content: string };
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    // Build up a new array of messages and ensure the literal types are preserved.
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: input }];
    // Simulate assistant response. Replace this with fetch to your API.
    const assistantReply = `You said: ${input}. Here's a basic analysis based on moving averages and RSI.`;
    // Cast the assistant message to ChatMessage so TypeScript preserves the literal
    // string union type for the role.  Without this cast, TS may widen the
    // role to `string` and cause an incompatibility error on build.
    setMessages([...newMessages, { role: 'assistant', content: assistantReply } as ChatMessage]);
    setInput('');
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <Link href="/">
        <a style={{ marginBottom: '1rem', display: 'inline-block', color: '#0070f3' }}>&larr; Back to home</a>
      </Link>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Evaluate</h1>
      <p style={{ maxWidth: '600px', marginBottom: '1.5rem' }}>
        Chat with the AI to evaluate market conditions and understand key indicators. Use the input below to
        ask questions about moving averages, RSI, candlestick patterns and more.
      </p>
      <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', minHeight: '300px', marginBottom: '1rem', overflowY: 'auto' }}>
        {messages.length === 0 && <p style={{ color: '#999' }}>Start by typing a question…</p>}
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '0.75rem' }}>
            <strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Ask the AI…"
          style={{ flexGrow: 1, padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button onClick={sendMessage} style={{ padding: '0.5rem 1rem', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}>
          Send
        </button>
      </div>
    </main>
  );
}
