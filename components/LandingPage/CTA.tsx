import React from 'react';

interface CTAProps {
    content: {
        headline: string;
        cta: string;
    };
}

const CTA: React.FC<CTAProps> = ({ content }) => {
  return (
    <section className="py-20 bg-brand-primary-600">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          {content.headline}
        </h2>
        <div className="mt-8">
          <a
            href="#"
            className="inline-block bg-white text-brand-primary-600 font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-neutral-100 transform hover:scale-105 transition-transform"
          >
            {content.cta}
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTA;
