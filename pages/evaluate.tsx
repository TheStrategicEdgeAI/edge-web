import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

interface SubscriptionInfo {
  plan: string;
  entitlements: Record<string, any>;
  stripe_customer_id?: string;
}

export default function Evaluate() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [subInfo, setSubInfo] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([]);
  const [submitting, setSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadEntitlements() {
      if (!user) return;
      try {
        const res = await fetch(`/api/subscription?userId=${encodeURIComponent(user.id)}`);
        const data = await res.json();
        setSubInfo(data);
      } finally {
        setLoading(false);
      }
    }
    if (!authLoading) {
      if (user) {
        loadEntitlements();
      } else {
        router.push('/login');
      }
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return <div className="min-h-screen p-8">Loading…</div>;
  }
  if (!subInfo?.entitlements?.evaluate) {
    return <div className="min-h-screen p-8">Evaluate is not available for your plan.</div>;
  }
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    // Add user message to conversation
    setMessages((msgs) => [...msgs, { role: 'user', text: trimmed }]);
    setInputValue('');
    setSubmitting(true);
    try {
      const params = new URLSearchParams();
      params.set('topic', trimmed);
      if (user?.id) params.set('userId', user.id);
      const res = await fetch(`/api/evaluate?${params.toString()}`);
      const data = await res.json();
      const reply = data.summary || 'No summary available.';
      setMessages((msgs) => [...msgs, { role: 'assistant', text: reply }]);
    } catch (err) {
      console.error(err);
      setMessages((msgs) => [...msgs, { role: 'assistant', text: 'Sorry, an error occurred.' }]);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <div className="min-h-screen p-8 flex flex-col">
      <h1 className="text-3xl font-bold mb-4">Evaluate Assistant</h1>
      <div className="flex-1 overflow-y-auto max-h-[60vh] space-y-4 border border-gray-700 rounded-lg p-4 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-md ${msg.role === 'user' ? 'bg-gray-700 self-end text-right' : 'bg-gray-800 self-start'}`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask about any topic…"
          className="flex-1 p-2 rounded-md bg-gray-800 text-white"
        />
        <button type="submit" className="edge-btn" disabled={submitting}>
          {submitting ? '…' : 'Send'}
        </button>
      </form>
    </div>
  );
}
