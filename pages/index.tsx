import Link from 'next/link';
import { usePhases } from '@/context/ChatContext';
import type { PhaseId } from '@/types/chat';

export default function Home() {
  const phases = usePhases();

  const cards: { id: PhaseId; href: string }[] = [
    { id: 'evaluate', href: '/evaluate' },
    { id: 'design', href: '/design' },
    { id: 'generate', href: '/generate' },
    { id: 'evolve', href: '/evolve' },
  ];

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>The Strategic Edge AI</h1>
      <p style={{ color: '#555', marginBottom: 24 }}>
        Choose a phase of the EDGE Method to begin.
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        {cards.map((c) => {
          const p = phases[c.id]; // fully typed via PhaseId
          return (
            <Link
              key={c.id}
              href={c.href}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                padding: 16,
                textDecoration: 'none',
                color: 'inherit',
                background: '#fff',
              }}
            >
              <h3 style={{ margin: '4px 0 8px 0' }}>{p.title}</h3>
              <p style={{ margin: 0, color: '#666' }}>{p.description}</p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
