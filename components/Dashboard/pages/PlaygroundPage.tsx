
import React from 'react';
import URLAnalyzerPage from '../Playground/URLAnalyzerPage.tsx';

interface PlaygroundPageProps {
    activePage: string;
    content: any;
}

const PlaceholderPage: React.FC<{title: string}> = ({title}) => (
    <div>
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">{title}</h1>
        <p className="mt-4 text-neutral-600 dark:text-neutral-400">This feature is coming soon. For now, please check out the URL Analyzer.</p>
    </div>
);


const PlaygroundPage: React.FC<PlaygroundPageProps> = ({ activePage, content }) => {
    
    const renderSubPage = () => {
        switch(activePage) {
            case 'playground-analyzer':
                return <URLAnalyzerPage content={content.urlAnalyzer} />;
            case 'playground-text':
                return <PlaceholderPage title="Text Copilot" />;
            case 'playground-design':
                return <PlaceholderPage title="Design Copilot" />;
            case 'playground-data':
                return <PlaceholderPage title="Data Copilot" />;
            default:
                 // Default to the analyzer if a specific sub-page isn't matched
                return <URLAnalyzerPage content={content.urlAnalyzer} />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            {renderSubPage()}
        </div>
    );
};

export default PlaygroundPage;