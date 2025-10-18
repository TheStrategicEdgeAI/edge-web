import type { NextApiRequest, NextApiResponse } from 'next';
import type { Message } from '@/types/chat';

/**
 * Mock chat API to keep compile-time types strict.
 * Replace the body with your real LLM call.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { systemPrompt, messages } = req.body as {
      systemPrompt: string;
      messages: Message[];
    };

    const lastUser = [...messages].reverse().find((m) => m.role === 'user');

    const reply =
      `🤖 System: ${systemPrompt.slice(0, 80)}...\n\n` +
      (lastUser
        ? `You said: "${lastUser.content}". Here’s a phase-appropriate starter response.\n\n`
        : `No user message detected. Ask something to begin.\n\n`) +
      `• If you're on Evaluate: ask about MA/RSI basics.\n` +
      `• On Design: outline rules (entries, exits, filters).\n` +
      `• On Generate: paste finalized rules for code.\n` +
      `• On Evolve: paste backtest metrics for optimization.\n`;

    await new Promise((r) => setTimeout(r, 300));

    res.status(200).json({ reply });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'Unknown error' });
  }
}
