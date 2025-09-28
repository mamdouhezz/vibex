import React from 'react';
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import { dashboardContent } from '../../constants/dashboardContent';
import { Language } from '../../types';

interface WorkspaceSwitcherProps {
    language: Language;
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

const WorkspaceSwitcher: React.FC<WorkspaceSwitcherProps> = ({ language, isCollapsed, toggleSidebar }) => {
    const content = dashboardContent[language].sidebar;
    const CollapseIcon = language === 'ar' ? FiChevronsRight : FiChevronsLeft;
    const ExpandIcon = language === 'ar' ? FiChevronsLeft : FiChevronsRight;

    return (
        <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
            <div className={`flex items-center overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0' : 'w-full'}`}>
                 <div className="p-2 bg-brand-primary-100 dark:bg-brand-primary-900 rounded-lg me-3">
                    <span className="text-lg font-bold text-brand-primary-600 dark:text-brand-primary-100">V</span>
                 </div>
                 <div>
                    <p className="text-sm font-semibold whitespace-nowrap">{content.workspaceName}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">{content.planType}</p>
                 </div>
            </div>
            <button 
                onClick={toggleSidebar}
                className="p-2 -me-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                {isCollapsed ? <ExpandIcon size={20} /> : <CollapseIcon size={20} />}
            </button>
        </div>
    );
};

export default WorkspaceSwitcher;