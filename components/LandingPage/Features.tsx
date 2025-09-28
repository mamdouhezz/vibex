
import React from 'react';
import { FiTrendingUp, FiCheckCircle, FiZap } from 'react-icons/fi';

interface FeatureItem {
    title: string;
    description: string;
}

interface FeaturesProps {
    content: {
        title: string;
        subtext: string;
        items: FeatureItem[];
    };
}

const FeatureIcons = [
    <FiTrendingUp size={32} className="text-brand-primary-500" />,
    <FiCheckCircle size={32} className="text-brand-primary-500" />,
    <FiZap size={32} className="text-brand-primary-500" />,
];

const Features: React.FC<FeaturesProps> = ({ content }) => {
    return (
        <section className="py-20 bg-neutral-50 dark:bg-neutral-900">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-100">
                        {content.title}
                    </h2>
                    <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
                        {content.subtext}
                    </p>
                </div>
                <div className="mt-16 grid md:grid-cols-3 gap-8">
                    {content.items.map((item, index) => (
                        <div key={index} className="bg-light-background dark:bg-dark-background p-8 rounded-xl shadow-lg text-center">
                            <div className="flex justify-center mb-6">
                                {FeatureIcons[index % FeatureIcons.length]}
                            </div>
                            <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
                                {item.title}
                            </h3>
                            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
