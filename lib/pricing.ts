import pricingConfig from '../config/pricing.config.json';

export interface PlanLimits {
  messagesPerDay: number | string;
  savedProjects: number | string;
  downloadsEnabled: boolean;
}

export interface Plan {
  name: string;
  monthly: number;
  annual: number | null;
  features: Record<string, any>;
  limits: PlanLimits;
  stripePriceId: string | null;
}

interface PricingConfig {
  version: string;
  currency: string;
  plans: Record<string, Plan>;
}

const config: PricingConfig = pricingConfig as PricingConfig;

export function getPlans(): Record<string, Plan> {
  return config.plans;
}

export function getPlanByKey(key: string): Plan | null {
  return config.plans[key] || null;
}

export function getUsageLimits(key: string): PlanLimits | null {
  const plan = getPlanByKey(key);
  return plan ? plan.limits : null;
}
