// /config/pricing.ts
export const pricingConfig = {
  plans: {
    basic:  { name: 'Basic',  price: 0,   id: 'basic' },
    pro:    { name: 'Pro',    price: 147, id: 'pro' },
    elite:  { name: 'Elite',  price: 195, id: 'elite' },
  },
};

export type PlanKey = keyof typeof pricingConfig.plans;

// Optional helper if you need labels, features, etc.
// export const planFeatures: Record<PlanKey, string[]> = { basic: [], pro: [], elite: [] };
