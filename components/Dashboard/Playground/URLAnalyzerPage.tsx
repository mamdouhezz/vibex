import React, { useState } from 'react';
import { OrchestrationResult, Chunk, PreprocessingOutput, SchemaAnalysis } from '../../../types/index.ts';
import { analyzeUrl } from '../../../engine/index.ts';
import { FaExternalLinkAlt, FaInfoCircle } from 'react-icons/fa';
import { FiFileText, FiGrid, FiShare2, FiGlobe, FiTerminal, FiLoader, FiAlertTriangle } from 'react-icons/fi';

interface URLAnalyzerPageProps {
    content: any;
}

// --- Internal UI Components for Displaying New Results ---

const ResultTabs: React.FC<{ activeTab: string, setActiveTab: (tab: string) => void }> = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'overview', label: 'Overview', icon: FiFileText },
        { id: 'chunks', label: 'Content Chunks', icon: FiGrid },
        { id: 'schema', label: 'Schema', icon: FiTerminal },
        { id: 'graph', label: 'Knowledge Graph', icon: FiShare2 },
        { id: 'multilingual', label: 'Multilingual', icon: FiGlobe },
    ];
    return (
        <div className="border-b border-neutral-200 dark:border-neutral-700">
            <nav className="-mb-px flex space-x-6 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`whitespace-nowrap flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === tab.id
                                ? 'border-brand-primary-500 text-brand-primary-600 dark:text-brand-primary-100'
                                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200 hover:border-neutral-300'
                        }`}
                    >
                        <tab.icon className="me-2" />
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};

const JsonViewer: React.FC<{ data: any, title: string }> = ({ data, title }) => (
    <div className="bg-light-card dark:bg-dark-card p-6 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">{title}</h3>
        <pre className="text-sm bg-neutral-100 dark:bg-neutral-900 p-4 rounded-md overflow-x-auto text-neutral-700 dark:text-neutral-300">
            <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
    </div>
);

const OverviewTab: React.FC<{ data?: PreprocessingOutput }> = ({ data }) => {
    if (!data) return <p>No preprocessing data available.</p>;
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-light-card dark:bg-dark-card p-6 rounded-xl border border-neutral-200 dark:border-neutral-800">
                <h3 className="font-semibold text-lg mb-3">Metadata</h3>
                <p><strong>Title:</strong> {data.metadata.title}</p>
                <p><strong>Description:</strong> {data.metadata.description || 'N/A'}</p>
                <p><strong>Language:</strong> {data.metadata.lang.toUpperCase()}</p>
            </div>
            <div className="bg-light-card dark:bg-dark-card p-6 rounded-xl border border-neutral-200 dark:border-neutral-800">
                <h3 className="font-semibold text-lg mb-3">Content Metrics</h3>
                <p><strong>Word Count:</strong> {data.wordCount}</p>
                <p><strong>Readability Score:</strong> {data.readabilityScore}</p>
            </div>
        </div>
    );
};

const ChunksTab: React.FC<{ chunks?: Chunk[] }> = ({ chunks }) => {
    if (!chunks || chunks.length === 0) return <p>No content chunks were generated.</p>;
    return (
        <div className="space-y-4">
            {chunks.map(chunk => (
                <div key={chunk.id} className="bg-light-card dark:bg-dark-card p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
                    <p className="text-sm font-medium text-brand-primary-600 dark:text-brand-primary-100 mb-2">
                        Context: {chunk.headingContext.join(' > ')}
                    </p>
                    <p className="text-neutral-700 dark:text-neutral-300">{chunk.content}</p>
                    <p className="text-xs text-neutral-500 mt-2">Tokens: {chunk.tokenCount} | Position: {chunk.position}</p>
                </div>
            ))}
        </div>
    );
};

// A robust regular expression for client-side URL validation.
// This ensures the URL format is plausible before sending it to the backend.
const URL_VALIDATION_REGEX = new RegExp(
    '^(https?://)'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i' // fragment locator
);

// Main Page Component
const URLAnalyzerPage: React.FC<URLAnalyzerPageProps> = ({ content }) => {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<OrchestrationResult | null>(null);
    const [activeTab, setActiveTab] = useState('overview');

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Improved client-side validation for instant user feedback.
        if (!URL_VALIDATION_REGEX.test(url)) {
            setError(content.errorInvalidURL);
            return;
        }

        setError(null);
        setIsLoading(true);
        setResult(null);

        try {
            const analysisResult = await analyzeUrl(url);
            setResult(analysisResult);
            setActiveTab('overview');
        } catch (err: any) {
            console.error("Analysis failed:", err);
            setError(err.message || content.errorAnalysisFailed);
        } finally {
            setIsLoading(false);
        }
    };

    const renderTabContent = () => {
        if (!result) return null;
        switch(activeTab) {
            case 'overview': return <OverviewTab data={result.preprocessed} />;
            case 'chunks': return <ChunksTab chunks={result.chunks} />;
            case 'schema': return <JsonViewer data={result.schemas} title="Schema Analysis" />;
            case 'graph': return <JsonViewer data={result.graph} title="Knowledge Graph Data" />;
            case 'multilingual': return <JsonViewer data={result.multilingual} title="Multilingual Analysis" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">{content.title}</h1>
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">{content.description}</p>
            </div>

            <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-2">
                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={content.inputPlaceholder}
                    className="flex-grow w-full px-4 py-3 bg-light-card dark:bg-dark-card border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
                    aria-label="URL to analyze"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !url}
                    className="flex items-center justify-center px-6 py-3 font-semibold text-white bg-brand-primary-600 rounded-lg shadow-md hover:bg-brand-primary-700 transition-colors disabled:bg-neutral-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? <><FiLoader className="animate-spin me-2" />{content.analyzingText}</> : content.buttonText}
                </button>
            </form>
            
            {error && <div className="flex items-center p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                <FiAlertTriangle className="flex-shrink-0 inline w-4 h-4 me-3" />
                <span className="font-medium">{error}</span>
            </div>}

            {isLoading && (
                <div className="text-center py-10"><FiLoader className="animate-spin text-brand-primary-500 mx-auto text-4xl" /><p className="mt-4 text-neutral-500">{content.analyzingText}</p></div>
            )}
            
            {!isLoading && !result && (
                 <div className="text-center py-20 bg-light-card dark:bg-dark-card rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700">
                    <FaInfoCircle className="mx-auto text-4xl text-neutral-400" />
                    <h2 className="mt-4 text-xl font-semibold text-neutral-700 dark:text-neutral-200">{content.emptyStateTitle}</h2>
                    <p className="mt-1 text-neutral-500">{content.emptyStateDescription}</p>
                </div>
            )}

            {result && (
                <div className="space-y-6 animate-fade-in">
                    <div className="pb-4 border-b border-neutral-200 dark:border-neutral-800">
                         <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 flex items-center flex-wrap">
                            {content.resultsTitle}
                            <a href={url} target="_blank" rel="noopener noreferrer" className="ms-2 text-brand-primary-500 hover:underline text-lg font-normal break-all">
                                {url} <FaExternalLinkAlt className="inline ms-1 text-xs" />
                            </a>
                        </h2>
                    </div>
                    
                    <ResultTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                    <div className="mt-6">
                        {renderTabContent()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default URLAnalyzerPage;