import React from 'react';
import StatsCards from '../Overview/StatsCards.tsx';
import ChartsPanel from '../Overview/ChartsPanel.tsx';
// FIX: FaArrowTrendUp is not in react-icons/fa, so it has been replaced with FaChartLine. FaGlobe was unused and has been removed.
import { FaLightbulb, FaChartLine, FaChevronRight } from 'react-icons/fa';

interface HomePageProps {
    content: any;
}

const HomePage: React.FC<HomePageProps> = ({ content }) => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">{content.title}</h1>
            
            <StatsCards content={content.stats} />
            
            <ChartsPanel content={content.charts} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quickstarts */}
                <div className="lg:col-span-2 bg-light-card dark:bg-dark-card p-6 rounded-xl border border-neutral-200 dark:border-neutral-800">
                    <h2 className="text-xl font-semibold mb-4">{content.quickstarts.title}</h2>
                    <div className="grid sm:grid-cols-3 gap-4">
                        <button className="px-4 py-3 bg-brand-primary-600 text-white font-semibold rounded-lg hover:bg-brand-primary-700 transition-colors">{content.quickstarts.createTask}</button>
                        <button className="px-4 py-3 bg-neutral-200 dark:bg-neutral-700 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors">{content.quickstarts.addApiKey}</button>
                        <button className="px-4 py-3 bg-neutral-200 dark:bg-neutral-700 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors">{content.quickstarts.inviteTeam}</button>
                    </div>
                </div>

                {/* Tips & Hints */}
                 <div className="bg-light-card dark:bg-dark-card p-6 rounded-xl border border-neutral-200 dark:border-neutral-800">
                    <h2 className="text-xl font-semibold mb-4 flex items-center"><FaLightbulb className="text-yellow-400 me-2" /> {content.tips.title}</h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{content.tips.tip1}</p>
                 </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {/* News & Updates */}
                <div className="lg:col-span-2 bg-light-card dark:bg-dark-card p-6 rounded-xl border border-neutral-200 dark:border-neutral-800">
                     <h2 className="text-xl font-semibold mb-4">{content.news.title}</h2>
                     <ul className="space-y-3">
                        <li className="text-sm text-neutral-600 dark:text-neutral-300 flex justify-between items-center">
                            <span>{content.news.update1}</span>
                            <a href="#" className="text-brand-primary-500 hover:underline"><FaChevronRight/></a>
                        </li>
                     </ul>
                </div>
                {/* Market Trends */}
                 <div className="bg-light-card dark:bg-dark-card p-6 rounded-xl border border-neutral-200 dark:border-neutral-800">
                    {/* FIX: Replaced invalid FaArrowTrendUp icon with FaChartLine. */}
                     <h2 className="text-xl font-semibold mb-4 flex items-center"><FaChartLine className="text-green-500 me-2"/> {content.trends.title}</h2>
                     <p className="text-sm text-neutral-600 dark:text-neutral-400">{content.trends.trend1}</p>
                 </div>
             </div>

            <footer className="text-center pt-8">
                <a href="/" className="text-sm text-brand-primary-600 hover:underline">{content.backToHome}</a>
            </footer>
        </div>
    );
};

export default HomePage;