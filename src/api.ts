import defaultPapers from './data/papers.json';
import newsData from './data/news.json';
import historyData from './data/history.json';

export const getNews = () => newsData;
export const getHistory = () => historyData;

// Mutable in-memory store for the session to accept contributions
const localPapers: Paper[] = [...(defaultPapers as any as Paper[])];

export interface Author {
  name: string;
}

export interface Paper {
  paperId: string;
  title: string;
  abstract: string | null;
  authors: Author[];
  year: number | null;
  url: string;
  venue: string;
}

export const fetchPapers = async (query: string, limit: number = 20): Promise<Paper[]> => {
  // Simulate network delay to maintain the UI loading state briefly
  await new Promise(resolve => setTimeout(resolve, 600));

  const lowerQuery = query.toLowerCase().trim();

  if (!lowerQuery) {
    return localPapers.slice(0, limit);
  }

  const terms = lowerQuery.split(/\s+/);

  // Advanced scoring: count occurrences of query terms in title and abstract
  const scored = localPapers.map(paper => {
    let score = 0;
    const title = paper.title.toLowerCase();
    const abstract = (paper.abstract || '').toLowerCase();

    terms.forEach(term => {
      if (title.includes(term)) score += 10; // High weight for title match
      if (abstract.includes(term)) score += 2;  // Lower weight for abstract
      
      // Bonus for exact term matches
      const titleMatchCount = (title.match(new RegExp(`\\b${term}\\b`, 'g')) || []).length;
      const abstractMatchCount = (abstract.match(new RegExp(`\\b${term}\\b`, 'g')) || []).length;
      score += titleMatchCount * 5;
      score += abstractMatchCount * 1;
    });

    return { paper, score };
  });

  const filtered = scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.paper);

  return filtered.slice(0, limit);
};

/**
 * Specialized retrieval for RAG synthesis. 
 * Picks papers that best match the question to maximize context quality.
 */
export const getRelevantPapers = (question: string, limit: number = 30): Paper[] => {
  const lowerQuestion = question.toLowerCase();
  const terms = lowerQuestion.split(/\s+/).filter(t => t.length > 3); // Ignore small words

  const ranked = localPapers.map(paper => {
    let score = 0;
    const text = `${paper.title} ${paper.abstract}`.toLowerCase();
    terms.forEach(term => {
      if (text.includes(term)) score += 1;
    });
    return { paper, score };
  });

  return ranked
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.paper);
};

export const getTotalPapersCount = () => localPapers.length;

export const addCustomPaper = (paper: Paper) => {
  // Unshift adds the paper to the very beginning so it shows up first!
  localPapers.unshift(paper);
};
