/**
 * VibeX Mock Analysis Data
 *
 * This file provides a sample analysis result based on the backend PRD.
 * It's used to simulate the output of the AEO/GEO engine for frontend development.
 */

// FIX: Imported Recommendation type to ensure mock data conforms to the application's type system.
import { Recommendation } from '../types/index.ts';

export const getMockAnalysisResult = () => {
  // FIX: Declared recommendations as Recommendation[] to fix type inference issues.
  const recommendations: Recommendation[] = [
    {
      type: "schema_fix",
      priority: "high",
      target: "page",
      message: "Add FAQPage schema to capture common questions and improve your chances of being featured in AI answers.",
      suggested_code: `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What is AEO?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Answer Engine Optimization (AEO) is the process of optimizing your content to appear directly in the answers provided by AI engines like Google, ChatGPT, and Perplexity."
    }
  }]
}`
    },
    {
        type: "trust_fix",
        priority: "high",
        target: "page",
        message: "Add author information and a 'last updated' date to build trust and authority, which are key signals for AI engines.",
        example_fix: { "author": "Alex Doe", "last_updated": new Date().toISOString().split('T')[0] }
    },
    {
      type: "content_fix",
      priority: "medium",
      target: "Section: 'Why is AEO Important?'",
      message: "Split this long section (160 words) into smaller, more focused chunks. AI engines prefer to cite paragraphs under 150 words.",
      example_fix: ["Benefit 1: Increased Visibility...", "Benefit 2: Higher Authority...", "Benefit 3: Future-Proofing..."]
    },
    {
        type: "snippet_fix",
        priority: "low",
        target: "Section: 'Why is AEO Important?'",
        message: "Rewrite the introductory paragraph to be a more direct, 'answer-first' snippet of about 40-60 words.",
        example_fix: "AEO is crucial because user behavior is shifting from clicking links to consuming direct answers from AI. By optimizing for AEO, your brand becomes the authoritative source, ensuring visibility and relevance in the new age of search."
    }
  ];

  return {
    url: "https://example.com/ai-seo-guide",
    citation_probability: 0.82,
    platform_predictions: {
      ChatGPT: 0.85,
      Gemini: 0.78,
      Perplexity: 0.83,
    },
    chunks: [
      {
        id: "chunk_001",
        heading: "What is AEO?",
        text: "Answer Engine Optimization (AEO) is the process of optimizing content to be directly cited by AI-driven answer engines like ChatGPT, Gemini, and Perplexity. It focuses on structured data, concise answers, and clear authority signals.",
        length: 55,
        snippet_ready: true,
      },
      {
          id: "chunk_002",
          heading: "Why is AEO Important?",
          text: "With the rise of generative AI, users are getting direct answers instead of just links. If your content isn't optimized for AEO, you lose visibility in this new paradigm. It's about being the source of the answer, not just a link on a page. This is a very long section that is designed to demonstrate a recommendation to split it into smaller chunks for better AI consumption. We need to make sure the content is long enough to trigger the rule.",
          length: 160,
          snippet_ready: false,
      }
    ],
    schema: {
      detected: ["Article"],
      missing: ["FAQPage", "Product"],
    },
    snippets: [
      {
        heading: "What is AEO?",
        snippet: "Answer Engine Optimization (AEO) means structuring content so AI systems like ChatGPT and Gemini can easily cite it as an answer, improving brand visibility without relying on traditional clicks.",
        score: 0.91,
      },
      {
          heading: "Why is AEO Important?",
          snippet: "⚠️ Content too long for an effective snippet.",
          score: 0.25,
      }
    ],
    recommendations,
  };
};

export type AnalysisResult = ReturnType<typeof getMockAnalysisResult>;