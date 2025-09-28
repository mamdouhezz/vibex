import React from 'react';

interface Step {
    title: string;
    description: string;
}

interface HowItWorksProps {
    content: {
        title: string;
        steps: Step[];
    };
}

const HowItWorks: React.FC<HowItWorksProps> = ({ content }) => {
    return (
        <section className="py-20">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-100">
                        {content.title}
                    </h2>
                </div>
                <div className="mt-16 max-w-4xl mx-auto">
                    <div className="relative">
                        {/* Connecting line */}
                        <div className="hidden md:block absolute top-5 left-1/2 w-0.5 h-[calc(100%-2.5rem)] bg-neutral-300 dark:bg-neutral-700 -translate-x-1/2"></div>
                        
                        {content.steps.map((step, index) => (
                            <div key={index} className="relative md:grid md:grid-cols-2 md:gap-12 items-center mb-12 last:mb-0">
                                <div className={`flex items-center justify-center md:justify-start ${index % 2 !== 0 ? 'md:order-last' : ''}`}>
                                    <div className="z-10 bg-brand-primary-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                                        {index + 1}
                                    </div>
                                </div>
                                <div className={`mt-4 md:mt-0 text-center md:text-start ${index % 2 !== 0 ? 'md:text-end' : ''}`}>
                                    <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">{step.title}</h3>
                                    <p className="mt-2 text-neutral-600 dark:text-neutral-400">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;