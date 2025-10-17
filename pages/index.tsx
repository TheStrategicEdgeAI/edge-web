import React from 'react';
import Footer from '../components/Footer';

// Import pricing configuration at build time. This ensures the landing page always shows
// the canonical prices defined in pricing.config.json. If you adjust plan names or
// amounts, update pricing.config.json and redeploy.
import pricingConfig from '../pricing.config.json';

interface Plan {
  id: string;
  label: string;
  price: number;
  features: {
    evaluate: boolean;
    design: boolean;
    generate: boolean;
    evolve: boolean;
    dailyDesignLimit: number | null;
    dailyGenerateLimit: number | null;
    dailyEvolveLimit: number | null;
  };
}

export default function Home() {
  const plans: Plan[] = Object.values(pricingConfig.plans);
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow p-8 flex flex-col items-center text-center space-y-12">
        <header>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">The Strategic Edge AI</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
            Transform your trading with AI‑driven insights, strategy generation and performance analytics.
          </p>
        </header>

        {/* Key features section */}
        <section className="w-full max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="edge-card">
              <h3 className="text-xl font-semibold mb-2">Evaluate</h3>
              <p className="text-sm text-gray-300">
                Upload your trade results or pick a topic to receive actionable summaries and performance
                analytics. Identify strengths, weaknesses and opportunities for improvement in minutes.
              </p>
            </div>
            <div className="edge-card">
              <h3 className="text-xl font-semibold mb-2">Design & Generate</h3>
              <p className="text-sm text-gray-300">
                Describe your strategy using approved indicators and let our AI design a conceptual plan and
                produce production‑ready code in NinjaScript or PineScript.
              </p>
            </div>
            <div className="edge-card">
              <h3 className="text-xl font-semibold mb-2">Evolve</h3>
              <p className="text-sm text-gray-300">
                Backtest and refine your strategies with advanced metrics and scenario drills. Gain
                confidence by running stress tests and exploring “what if” situations.
              </p>
            </div>
          </div>
        </section>

        {/* EDGE Method explainer */}
        <section className="w-full max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">Our EDGE Method</h2>
          <p className="text-gray-300">
            Our framework guides you through Evaluate, Design, Generate and Evolve steps to build and
            optimize trading strategies efficiently. We help you learn the foundations, design robust
            systems, generate code, and continuously evolve through analytics and scenario testing.
          </p>
        </section>

        {/* Pricing section */}
        <section className="w-full max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className="edge-card flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{plan.label}</h3>
                  <p className="text-3xl font-bold mb-4">${plan.price}/mo</p>
                  <ul className="text-left space-y-1 mb-4">
                    {plan.features.evaluate && <li>Evaluate access</li>}
                    {plan.features.design && <li>Design access</li>}
                    {plan.features.generate && <li>Generate access</li>}
                    {plan.features.evolve && <li>Evolve access</li>}
                  </ul>
                </div>
                <button
                  className="edge-btn mt-auto"
                  onClick={() => {
                    // Direct users to the signup page with a plan query parameter.
                    window.location.href = `/signup?plan=${plan.id}`;
                  }}
                >
                  Get started
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
