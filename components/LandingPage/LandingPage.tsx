import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { landingContent } from '../../constants/landingContent';
import { useTheme } from '../../hooks/useTheme';

import Navbar from './Navbar';
import Hero from './Hero';
import Features from './Features';
import HowItWorks from './HowItWorks';
import Testimonials from './Testimonials';
import Pricing from './Pricing';
import CTA from './CTA';
import Footer from './Footer';

const LandingPage: React.FC = () => {
    const [language, setLanguage] = useState<Language>('en');
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        const storedLang = localStorage.getItem('vibex-lang') as Language | null;
        if (storedLang) {
            setLanguage(storedLang);
        }
    }, []);

    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        localStorage.setItem('vibex-lang', language);
    }, [language]);

    const content = landingContent[language];

    return (
        <div className="bg-light-background dark:bg-dark-background text-light-foreground dark:text-dark-foreground font-display">
            <Navbar
                content={content.navbar}
                language={language}
                setLanguage={setLanguage}
                theme={theme}
                setTheme={setTheme}
            />
            <main>
                <Hero content={content.hero} />
                <Features content={content.features} />
                <HowItWorks content={content.howItWorks} />
                <Testimonials content={content.testimonials} />
                <Pricing content={content.pricing} />
                <CTA content={content.cta} />
            </main>
            <Footer content={content.footer} />
        </div>
    );
};

export default LandingPage;