import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../../hooks/useTheme.ts';

interface ChartsPanelProps {
    content: any;
}

const usageData = [
    { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
];

const ChartsPanel: React.FC<ChartsPanelProps> = ({ content }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const axisColor = isDark ? '#9CA3AF' : '#4B5563';
    const gridColor = isDark ? '#374151' : '#E5E7EB';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-light-card dark:bg-dark-card p-6 rounded-xl border border-neutral-200 dark:border-neutral-800">
                <h2 className="text-xl font-semibold mb-4 text-neutral-800 dark:text-neutral-100">{content.usageTitle}</h2>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <LineChart data={usageData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="name" stroke={axisColor} />
                            <YAxis stroke={axisColor} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                                    borderColor: isDark ? '#374151' : '#E5E7EB'
                                }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="lg:col-span-2 bg-light-card dark:bg-dark-card p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-center">
                 <div className="text-center">
                    <h2 className="text-xl font-semibold mb-4 text-neutral-800 dark:text-neutral-100">{content.marketTitle}</h2>
                    <p className="text-neutral-500">D3 Bar Chart coming soon.</p>
                </div>
            </div>
        </div>
    );
};

export default ChartsPanel;