import React from 'react';
import pricingConfig from '../pricing.config.json';

export default function Home() {
  const plans = Object.values(pricingConfig.plans);
  return (
    <div className="min-h-screen p-8 flex flex-col items-center text-center space-y-8">
      <header>
        <h1 className="text-4xl md:text-5xl font-bold mb-2">The Strategic Edge AI</h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
          Transform your trading with AI-driven insights, strategy generation and performance analytics.
        </p>
      </header>
      <section className="w-full max-w-6xl">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan: any) => (
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
                  window.location.href = `/signup?plan=${plan.id}`;
                }}
              >
                Get started
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
