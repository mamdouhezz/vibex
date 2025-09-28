
import React from 'react';

export const HeroIllustration: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 512 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="256" cy="256" r="200" className="fill-brand-primary-100 dark:fill-brand-primary-900" />
    <circle cx="256" cy="256" r="150" className="fill-brand-primary-500" />
    <circle cx="150" cy="150" r="50" className="fill-brand-highlight-400" />
    <circle cx="350" cy="350" r="75" className="fill-brand-highlight-500" />
  </svg>
);
