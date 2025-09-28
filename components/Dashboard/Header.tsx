import React from 'react';
import { FiSearch, FiBell, FiUser, FiChevronDown, FiGlobe, FiMenu } from 'react-icons/fi';
import { dashboardContent } from '../../constants/dashboardContent.ts';
import { Language } from '../../types/index.ts';

interface HeaderProps {
    language: Language;
    setLanguage: (lang: Language) => void;
    toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage, toggleSidebar }) => {
    const content = dashboardContent[language].header;

    const handleLanguageToggle = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };

    return (
        <header className="flex w-full items-center justify-between h-16 px-4 md:px-6 bg-light-card dark:bg-dark-card border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
            {/* Left side: Mobile menu/search or Desktop search input */}
            <div className="flex items-center space-x-2">
                 <button onClick={toggleSidebar} className="lg:hidden p-2 -ms-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800" aria-label="Toggle Sidebar">
                    <FiMenu className="text-neutral-600 dark:text-neutral-300" size={22} />
                </button>
                 <button className="lg:hidden p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800">
                    <FiSearch className="text-neutral-600 dark:text-neutral-300" size={22} />
                </button>
                <div className="hidden lg:block relative">
                    <FiSearch className="absolute top-1/2 start-3 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="text"
                        placeholder={content.searchPlaceholder}
                        className="w-full max-w-xs ps-10 pe-4 py-2 bg-neutral-100 dark:bg-dark-background border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
                    />
                </div>
            </div>

            {/* Right side: Actions */}
            <div className="flex items-center space-x-2 md:space-x-4">
                <button
                    onClick={handleLanguageToggle}
                    className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    aria-label="Toggle language"
                >
                    <FiGlobe className="text-neutral-600 dark:text-neutral-300" size={22} />
                </button>

                <button className="relative p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                    <FiBell size={22} />
                    <span className="absolute top-1 end-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-semantic-error opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-semantic-error"></span>
                    </span>
                </button>

                <div className="hidden sm:block h-8 w-px bg-neutral-200 dark:bg-neutral-700"></div>

                <div className="flex items-center space-x-2 cursor-pointer p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
                    <FiUser className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 p-1 text-neutral-600 dark:text-neutral-300" />
                    <div className="hidden md:block">
                        <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">Alex Doe</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">Admin</p>
                    </div>
                    <FiChevronDown className="hidden md:block text-neutral-500"/>
                </div>
            </div>
        </header>
    );
};

export default Header;