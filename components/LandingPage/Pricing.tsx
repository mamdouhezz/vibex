import React from 'react';

interface Plan {
    name: string;
    description: string;
    cta: string;
    highlight?: boolean;
}

interface PricingProps {
    content: {
        title: string;
        subtext: string;
        plans: Plan[];
    };
}

const Pricing: React.FC<PricingProps> = ({ content }) => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-100">
            {content.title}
          </h2>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
            {content.subtext}
          </p>
        </div>
        <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {content.plans.map((plan, index) => (
            <div key={index} className={`p-8 rounded-xl shadow-lg border ${plan.highlight ? 'border-brand-highlight-500' : 'border-neutral-200 dark:border-neutral-800'}`}>
              <h3 className={`text-2xl font-semibold ${plan.highlight ? 'text-brand-highlight-500' : 'text-neutral-800 dark:text-neutral-200'}`}>{plan.name}</h3>
              <p className="mt-4 text-neutral-600 dark:text-neutral-400">{plan.description}</p>
              <a href="#" className={`mt-8 block w-full text-center px-6 py-3 rounded-lg font-semibold transition-colors ${plan.highlight ? 'bg-brand-highlight-500 text-white hover:bg-amber-500' : 'bg-brand-primary-600 text-white hover:bg-brand-primary-700'}`}>
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
