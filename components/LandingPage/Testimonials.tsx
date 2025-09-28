
import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';

interface TestimonialItem {
    quote: string;
    author: string;
}

interface TestimonialsProps {
    content: {
        title: string;
        items: TestimonialItem[];
    };
}

const Testimonials: React.FC<TestimonialsProps> = ({ content }) => {
    return (
        <section className="py-20 bg-neutral-50 dark:bg-neutral-900">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-100">
                        {content.title}
                    </h2>
                </div>
                <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {content.items.map((item, index) => (
                        <div key={index} className="bg-light-background dark:bg-dark-background p-8 rounded-xl shadow-lg">
                            <FaQuoteLeft className="text-brand-primary-400 text-3xl mb-4" />
                            <blockquote className="text-lg text-neutral-700 dark:text-neutral-300 italic">
                                "{item.quote}"
                            </blockquote>
                            <p className="mt-4 font-semibold text-neutral-800 dark:text-neutral-200">
                                — {item.author}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
