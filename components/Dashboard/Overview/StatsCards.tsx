import React from 'react';
import { FaChartLine, FaUsers, FaClock, FaPercent } from 'react-icons/fa';

interface StatsCardsProps {
    content: any;
}

const statsData = [
    { key: 'mrr', value: '$12,430', icon: FaChartLine, color: 'text-green-500' },
    { key: 'activeUsers', value: '1,287', icon: FaUsers, color: 'text-blue-500' },
    { key: 'sessions', value: '8,921', icon: FaClock, color: 'text-yellow-500' },
    { key: 'churnRate', value: '2.1%', icon: FaPercent, color: 'text-red-500' },
];

const StatsCards: React.FC<StatsCardsProps> = ({ content }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsData.map((stat) => (
                <div key={stat.key} className="bg-light-card dark:bg-dark-card p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center">
                    <div className={`p-3 rounded-full bg-opacity-10 ${stat.color.replace('text-','bg-')}`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className="ms-4">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">{content[stat.key]}</p>
                        <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">{stat.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;