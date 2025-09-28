import React, { useState, useEffect } from 'react';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { Language, ThemeMode } from '../../types';

interface NavbarProps {
    content: any;
    language: Language;
    setLanguage: (lang: Language) => void;
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
}

const Navbar: React.FC<NavbarProps> = ({ content, language, setLanguage, theme, setTheme }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLanguageToggle = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
        // Analytics placeholder:
        // trackEvent('language_toggled', { to: language === 'en' ? 'ar' : 'en' });
    };

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-light-background/80 dark:bg-dark-background/80 backdrop-blur-sm shadow-md' : 'bg-transparent'}`}>
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold text-brand-primary-600 dark:text-brand-primary-100">{content.logo}</div>
                
                <div className="hidden md:flex items-center space-x-8">
                    {content.links.map((link: string) => (
                        <a key={link} href="#" className="text-neutral-600 dark:text-neutral-300 hover:text-brand-primary-600 dark:hover:text-white transition-colors">{link}</a>
                    ))}
                </div>

                <div className="flex items-center space-x-4">
                     <button onClick={handleLanguageToggle} className="hidden md:block text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:text-brand-primary-600 dark:hover:text-white transition-colors">
                        {content.langToggle}
                    </button>
                    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                        {theme === 'dark' ? <FiSun className="text-yellow-400" /> : <FiMoon className="text-neutral-600"/>}
                    </button>
                    <a href="#" className="hidden md:block bg-brand-primary-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-brand-primary-700 transition-colors">{content.cta}</a>
                    <button className="md:hidden text-2xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </nav>
            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-light-background dark:bg-dark-background pb-4 px-6 space-y-4">
                    {content.links.map((link: string) => (
                        <a key={link} href="#" className="block text-neutral-600 dark:text-neutral-300 hover:text-brand-primary-600 dark:hover:text-white transition-colors">{link}</a>
                    ))}
                    <button onClick={handleLanguageToggle} className="w-full text-start font-semibold text-neutral-600 dark:text-neutral-300 hover:text-brand-primary-600 dark:hover:text-white transition-colors">
                        {language === 'en' ? 'العربية' : 'English'}
                    </button>
                     <a href="#" className="block w-full text-center bg-brand-primary-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-brand-primary-700 transition-colors">{content.cta}</a>
                </div>
            )}
        </header>
    );
};

export default Navbar;