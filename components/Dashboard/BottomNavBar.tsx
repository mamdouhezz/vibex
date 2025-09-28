import React from 'react';
import { FiGrid, FiCheckSquare, FiPieChart, FiTrello, FiMenu } from 'react-icons/fi';
import { Language } from '../../types/index.ts';
import { dashboardContent } from '../../constants/dashboardContent.ts';

interface BottomNavBarProps {
    activePage: string;
    setActivePage: (page: string) => void;
    language: Language;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activePage, setActivePage, language }) => {
    const content = dashboardContent[language].sidebar;

    const navItems = [
        { id: 'home', defaultSubPage: 'home-overview', icon: FiGrid, label: content.home.label },
        { id: 'tasks', defaultSubPage: 'tasks-all', icon: FiCheckSquare, label: content.tasks.label },
        { id: 'projects', defaultSubPage: 'projects-kanban', icon: FiTrello, label: content.projects.label },
        { id: 'analytics', defaultSubPage: 'analytics-traffic', icon: FiPieChart, label: content.analytics.label },
        { id: 'menu', icon: FiMenu, label: content.more },
    ];

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-light-card dark:bg-dark-card border-t border-neutral-200 dark:border-neutral-800 z-50">
            <div className="flex justify-around items-center h-16">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => {
                            if (item.id !== 'menu') {
                                setActivePage(item.defaultSubPage || item.id);
                            }
                            // The 'menu' button could open a modal/sheet with more options.
                        }}
                        className={`flex flex-col items-center justify-center w-full h-full transition-colors p-1 ${
                            activePage.startsWith(item.id)
                                ? 'text-brand-primary-600 dark:text-brand-primary-100'
                                : 'text-neutral-500 dark:text-neutral-400 hover:text-brand-primary-500'
                        }`}
                    >
                        <item.icon size={24} />
                        <span className="text-xs mt-1 font-medium">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BottomNavBar;