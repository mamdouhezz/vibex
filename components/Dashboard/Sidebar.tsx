
import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiLogOut } from 'react-icons/fi';
import { dashboardContent } from '../../constants/dashboardContent.ts';
import { Language } from '../../types/index.ts';
import WorkspaceSwitcher from './WorkspaceSwitcher.tsx';
import { NAVIGATION_STRUCTURE } from '../../constants/navigation.ts';

interface SidebarProps {
    activePage: string;
    setActivePage: (page: string) => void;
    language: Language;
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, language, isCollapsed, toggleSidebar }) => {
    const content = dashboardContent[language].sidebar;
    const [openMenu, setOpenMenu] = useState<string | null>(activePage.split('-')[0]);
    
    useEffect(() => {
        if (!isCollapsed) {
            setOpenMenu(activePage.split('-')[0]);
        } else {
            setOpenMenu(null);
        }
    }, [activePage, isCollapsed]);


    const NavItem = ({ item }: { item: typeof NAVIGATION_STRUCTURE[0] }) => {
        const isActive = activePage.startsWith(item.id);
        const isOpen = openMenu === item.id;
        const itemContent = content[item.id as keyof typeof content] as { label: string, subPages: { [key: string]: string } };

        return (
            <div>
                <button
                    onClick={() => {
                        if (isCollapsed) {
                            toggleSidebar();
                            setOpenMenu(item.id);
                        } else {
                            setOpenMenu(isOpen ? null : item.id);
                        }
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-base font-medium rounded-lg transition-colors group ${
                        isActive
                            ? 'bg-brand-primary-100 text-brand-primary-700 dark:bg-brand-primary-900 dark:text-white'
                            : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                     title={isCollapsed ? itemContent.label : undefined}
                >
                    <div className="flex items-center">
                        <item.icon className={`w-6 h-6 ${isCollapsed ? '' : 'me-3'}`} />
                        <span className={`${isCollapsed ? 'hidden' : 'block'}`}>{itemContent.label}</span>
                    </div>
                    {!isCollapsed && (
                        <FiChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    )}
                </button>
                {isOpen && !isCollapsed && (
                     <div className="ps-8 pt-2 space-y-1">
                        {item.subPages.map(subPage => (
                             <button
                                key={subPage.id}
                                onClick={() => setActivePage(subPage.id)}
                                className={`w-full text-start block px-4 py-2 text-sm rounded-md ${
                                    activePage === subPage.id
                                        ? 'font-semibold text-brand-primary-600 dark:text-brand-primary-100'
                                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                                }`}
                             >
                                {itemContent.subPages[subPage.id as keyof typeof itemContent.subPages]}
                             </button>
                        ))}
                     </div>
                )}
            </div>
        );
    };

    return (
        <aside className={`hidden lg:flex flex-col bg-light-card dark:bg-dark-card border-e border-neutral-200 dark:border-neutral-800 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'}`}>
            <WorkspaceSwitcher 
                language={language} 
                isCollapsed={isCollapsed}
                toggleSidebar={toggleSidebar}
            />
            <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                {NAVIGATION_STRUCTURE.map(item => <NavItem key={item.id} item={item} />)}
            </nav>
            <div className="px-4 py-4 mt-auto border-t border-neutral-200 dark:border-neutral-800">
                <button
                    className={`w-full flex items-center px-4 py-2.5 text-base font-medium rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${isCollapsed ? 'justify-center' : ''}`}
                     title={isCollapsed ? content.logout : undefined}
                >
                    <FiLogOut className={`w-6 h-6 ${isCollapsed ? '' : 'me-3'}`} />
                    <span className={`${isCollapsed ? 'hidden' : 'block'}`}>{content.logout}</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;