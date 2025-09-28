import React from 'react';
import { HeroIllustration } from '../common/Illustrations';

interface HeroProps {
    content: {
        headline: string;
        subheadline: string;
        ctaPrimary: string;
        ctaSecondary: string;
    };
}

const Hero: React.FC<HeroProps> = ({ content }) => {
    return (
        <section className="pt-32 pb-20 md:pt-40 md:pb-24">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-10 items-center">
                    <div className="text-center md:text-start">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-800 dark:text-white leading-tight">
                            {content.headline}
                        </h1>
                        <p className="mt-6 text-lg md:text-xl text-neutral-600 dark:text-neutral-300 max-w-xl mx-auto md:mx-0">
                            {content.subheadline}
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <a
                                href="#"
                                className="bg-brand-primary-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-brand-primary-700 transition-all transform hover:scale-105"
                            >
                                {content.ctaPrimary}
                            </a>
                            <a
                                href="#"
                                className="bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold px-8 py-3 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-all"
                            >
                                {content.ctaSecondary}
                            </a>
                        </div>
                    </div>
                    <div className="max-w-md mx-auto md:max-w-none">
                       <HeroIllustration />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;