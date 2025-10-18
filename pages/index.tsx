import Link from 'next/link';
import pricing from '../pricing.config.json';

// Landing page with hero, features and pricing sections.
export default function Home() {
  const { plans } = pricing;
  return (
    <main style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>The Strategic Edge AI</h1>
        <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
          Unlock smarter trading strategies with our AI‑driven platform. Evaluate, design,
          generate and evolve your trading system with ease.
        </p>
        <div style={{ marginTop: '2rem' }}>
          <Link href="#pricing" legacyBehavior>
            <a style={{ padding: '0.75rem 1.5rem', backgroundColor: '#0070f3', color: 'white', borderRadius: '4px', textDecoration: 'none' }}>
              View Plans
            </a>
          </Link>
        </div>
      </section>
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '1rem' }}>Key Features</h2>
        <ul style={{ display: 'flex', justifyContent: 'space-around', listStyle: 'none', padding: 0 }}>
          <li style={{ maxWidth: '250px' }}>
            <h3>Evaluate</h3>
            <p>Get AI insights on market conditions and core indicators.</p>
          </li>
          <li style={{ maxWidth: '250px' }}>
            <h3>Design</h3>
            <p>Create custom strategies with our indicator whitelist and risk controls.</p>
          </li>
          <li style={{ maxWidth: '250px' }}>
            <h3>Generate</h3>
            <p>Transform your strategy into complete NinjaScript and Pine scripts.</p>
          </li>
          <li style={{ maxWidth: '250px' }}>
            <h3>Evolve</h3>
            <p>Upload backtests and receive metrics, scenarios and improvement ideas.</p>
          </li>
        </ul>
      </section>
      <section id="pricing" style={{ marginBottom: '3rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '1rem' }}>Pricing</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {Object.entries(plans).map(([key, plan]) => {
            return (
              <div key={key} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1.5rem', maxWidth: '250px' }}>
                <h3>{plan.name}</h3>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${plan.price}/mo</p>
                <ul>
                  {key === 'basic' && (
                    <>
                      <li>Evaluate & Design</li>
                      <li>Limited daily quotas</li>
                    </>
                  )}
                  {key === 'pro' && (
                    <>
                      <li>Everything in Basic</li>
                      <li>Access Generate & Evolve</li>
                      <li>Higher daily limits</li>
                    </>
                  )}
                  {key === 'elite' && (
                    <>
                      <li>Everything in Pro</li>
                      <li>Priority processing</li>
                      <li>Highest daily limits</li>
                    </>
                  )}
                </ul>
                <div style={{ marginTop: '1rem' }}>
                  {/* Link to call the API for checkout; placeholder only */}
                  <Link href={`/checkout?plan=${key}`} legacyBehavior>
                    <a style={{ display: 'block', textAlign: 'center', padding: '0.5rem 1rem', backgroundColor: '#0070f3', color: 'white', borderRadius: '4px', textDecoration: 'none' }}>
                      Get Started
                    </a>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <footer style={{ textAlign: 'center', marginTop: '4rem', fontSize: '0.875rem', color: '#666' }}>
        © {new Date().getFullYear()} The Strategic Edge AI. All rights reserved.
      </footer>
    </main>
  );
}