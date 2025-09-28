import React from 'react';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';

interface FooterProps {
    content: {
        links: string[];
        copyright: string;
    };
}

const Footer: React.FC<FooterProps> = ({ content }) => {
    return (
        <footer className="bg-neutral-900 text-neutral-400">
            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-start">
                    <div className="mb-6 md:mb-0">
                        <div className="flex space-x-6">
                            {content.links.map((link) => (
                                <a key={link} href="#" className="hover:text-white transition-colors">{link}</a>
                            ))}
                        </div>
                    </div>
                    <div className="flex space-x-6 mb-6 md:mb-0">
                        <a href="https://linkedin.com/company/vibex" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-white transition-colors"><FaLinkedin size={24} /></a>
                        <a href="https://twitter.com/vibex" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-white transition-colors"><FaTwitter size={24} /></a>
                        <a href="https://github.com/vibex" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-white transition-colors"><FaGithub size={24} /></a>
                    </div>
                </div>
                <div className="mt-8 border-t border-neutral-800 pt-8 text-center text-sm">
                    <p>{content.copyright}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;