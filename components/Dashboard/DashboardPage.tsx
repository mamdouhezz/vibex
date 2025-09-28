
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar.tsx';
import Header from './Header.tsx';
import BottomNavBar from './BottomNavBar.tsx';
import { dashboardContent } from '../../constants/dashboardContent.ts';
import { useTheme } from '../../hooks/useTheme.ts';
import { Language } from '../../types/index.ts';

// Import all page components
import HomePage from './pages/HomePage.tsx';
import TasksPage from './pages/TasksPage.tsx';
import UsersPage from './pages/UsersPage.tsx';
import APIsPage from './pages/APIsPage.tsx';
import SubscriptionPage from './pages/SubscriptionPage.tsx';
import SettingsPage from './pages/SettingsPage.tsx';
import HelpPage from './pages/HelpPage.tsx';
import AccountPage from './pages/AccountPage.tsx';
import AnalyticsPage from './pages/AnalyticsPage.tsx';
import UpdatesPage from './pages/UpdatesPage.tsx';
import TipsPage from './pages/TipsPage.tsx';
import IntegrationsPage from './pages/IntegrationsPage.tsx';
import WorkflowsPage from './pages/WorkflowsPage.tsx';
import KnowledgeBasePage from './pages/KnowledgeBasePage.tsx';
import PlaygroundPage from './pages/PlaygroundPage.tsx';
import CalendarPage from './pages/CalendarPage.tsx';
import ProjectsPage from './pages/ProjectsPage.tsx';
import AssetsPage from './pages/AssetsPage.tsx';
import TeamsPage from './pages/TeamsPage.tsx';
import LocalizationPage from './pages/LocalizationPage.tsx';
import SecurityCenterPage from './pages/SecurityCenterPage.tsx';
import MarketTrendsPage from './pages/MarketTrendsPage.tsx';
import MarketplacePage from './pages/MarketplacePage.tsx';
import DesignSystemPage from './pages/DesignSystemPage.tsx';
import NotificationsPage from './pages/NotificationsPage.tsx';
import LabsPage from './pages/LabsPage.tsx';
import GoalsPage from './pages/GoalsPage.tsx';
import CommunityPage from './pages/CommunityPage.tsx';


const DashboardPage: React.FC = () => {
    const [activePage, setActivePage] = useState('playground-analyzer');
    const [language, setLanguage] = useState<Language>('en');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const content = dashboardContent[language];
    useTheme(); // ensure theme is applied

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };
    
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


    const renderPage = () => {
        const pageId = activePage.split('-')[0];

        const pageMap: { [key: string]: React.ReactElement } = {
            home: <HomePage content={content.overview} />,
            tasks: <TasksPage />,
            users: <UsersPage />,
            apis: <APIsPage />,
            subscription: <SubscriptionPage />,
            settings: <SettingsPage />,
            help: <HelpPage />,
            account: <AccountPage />,
            analytics: <AnalyticsPage />,
            updates: <UpdatesPage />,
            tips: <TipsPage />,
            integrations: <IntegrationsPage />,
            workflows: <WorkflowsPage />,
            knowledge: <KnowledgeBasePage />,
            playground: <PlaygroundPage activePage={activePage} content={content} />,
            calendar: <CalendarPage />,
            projects: <ProjectsPage />,
            assets: <AssetsPage />,
            teams: <TeamsPage />,
            localization: <LocalizationPage />,
            security: <SecurityCenterPage />,
            trends: <MarketTrendsPage />,
            marketplace: <MarketplacePage />,
            "design-system": <DesignSystemPage />,
            notifications: <NotificationsPage />,
            labs: <LabsPage />,
            goals: <GoalsPage />,
            community: <CommunityPage />,
        };
        return pageMap[pageId] || <HomePage content={content.overview} />;
    };

    return (
        <div className={`flex h-screen bg-light-background dark:bg-dark-background text-light-foreground dark:text-dark-foreground font-sans`}>
            <Sidebar 
                activePage={activePage} 
                setActivePage={setActivePage} 
                language={language}
                isCollapsed={isSidebarCollapsed}
                toggleSidebar={toggleSidebar}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    language={language} 
                    setLanguage={setLanguage} 
                    toggleSidebar={toggleSidebar} 
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-50 dark:bg-dark-background p-4 sm:p-6 pb-20 lg:pb-6">
                    {renderPage()}
                </main>
            </div>
            <BottomNavBar activePage={activePage} setActivePage={setActivePage} language={language} />
        </div>
    );
};

export default DashboardPage;