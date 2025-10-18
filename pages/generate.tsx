import { useState } from 'react';
import Link from 'next/link';

/**
 * Generate page
 *
 * Allows the user to specify a strategy and generate code artifacts.  In
 * production this would enqueue a job via the API and poll for completion.
 */
export default function Generate() {
  const [platform, setPlatform] = useState<'ninja' | 'pine'>('ninja');
  const [indicators, setIndicators] = useState('');
  const [params, setParams] = useState('');
  const [status, setStatus] = useState<'idle' | 'queued' | 'done'>('idle');
  const [artifact, setArtifact] = useState<string | null>(null);

  const submitJob = () => {
    // In production: call /assistants/generate or similar API
    setStatus('queued');
    setTimeout(() => {
      // Fake artifact content
      const code = platform === 'ninja'
        ? `// NinjaScript code generated for ${indicators} with parameters ${params}\npublic void OnBarUpdate() { /* ... */ }`
        : `// Pine Script code generated for ${indicators} with parameters ${params}\nstrategy("Demo", overlay=true)\n// ...`;
      setArtifact(code);
      setStatus('done');
    }, 2000);
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <Link href="/">
        <a style={{ marginBottom: '1rem', display: 'inline-block', color: '#0070f3' }}>&larr; Back to home</a>
      </Link>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Generate Strategy Code</h1>
      <p style={{ maxWidth: '600px', marginBottom: '1.5rem' }}>
        Fill in the details of your strategy.  Pro and Elite tiers can generate complete scripts for NinjaScript or
        Pine.  This demo will simulate generation.
      </p>
      <div style={{ maxWidth: '600px' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Target Platform</label>
        <select value={platform} onChange={(e) => setPlatform(e.target.value as 'ninja' | 'pine')} style={{ marginBottom: '1rem', padding: '0.5rem' }}>
          <option value="ninja">NinjaScript</option>
          <option value="pine">Pine Script</option>
        </select>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Indicators</label>
        <input
          type="text"
          value={indicators}
          onChange={(e) => setIndicators(e.target.value)}
          placeholder="e.g. SMA, RSI"
          style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '1rem' }}
        />
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Parameters</label>
        <input
          type="text"
          value={params}
          onChange={(e) => setParams(e.target.value)}
          placeholder="Custom parameters for your strategy"
          style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '1rem' }}
        />
        <button onClick={submitJob} style={{ padding: '0.5rem 1rem', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}>
          Generate
        </button>
      </div>
      {status === 'queued' && <p style={{ marginTop: '1rem' }}>Generating your script…</p>}
      {status === 'done' && artifact && (
        <div style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
          <h3>Generated Script</h3>
          <pre style={{ whiteSpace: 'pre-wrap', overflowX: 'auto' }}>{artifact}</pre>
        </div>
      )}
    </main>
  );
}