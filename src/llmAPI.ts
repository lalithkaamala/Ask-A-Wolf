import type { Paper } from './api';

export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}

export const askGemini = async (
    question: string,
    history: ChatMessage[],
    contextPapers: Paper[],
    totalPapersCount: number,
    newsContext: Array<{ title: string; date: string; summary: string }>,
    historyContext: Array<{ period: string; event: string; description: string }>,
    apiKey: string
): Promise<string> => {
    // Injecting research papers
    const papersText = contextPapers
        .filter(p => p.abstract)
        .map((p, index) => {
            const authors = p.authors?.map(a => a.name).join(', ') || 'Unknown Authors';
            return `[Research ${index + 1}] Title: ${p.title}\nAuthors: ${authors}\nYear: ${p.year || 'N/A'}\nURL: ${p.url}\nAbstract: ${p.abstract}`;
        })
        .join('\n\n---\n\n');

    const newsText = newsContext.map(n => `[News] ${n.date}: ${n.title} - ${n.summary}`).join('\n');
    const historyText = historyContext.map(h => `[History] ${h.period}: ${h.event} - ${h.description}`).join('\n');

    const systemInstruction = `You are an expert wildlife biologist and research assistant specializing in the American Canid Project.
The library currently contains ${totalPapersCount} research documents in total.
Note: You are only provided with a slice of ${contextPapers.length} relevant papers for the current query to fit within your processing window.

Your knowledge comes from three streams:
1. RESEARCH PAPERS: Peer-reviewed literature.
2. INTELLIGENCE (NEWS): Recent developments (2025-2026).
3. CHRONICLES (HISTORY): Evolutionary and historical context.

RESOURCES:
---
RESEARCH PAPERS:
${papersText}

INTELLIGENCE REPORTS:
${newsText}

CHRONICLES:
${historyText}
---

OUTPUT RULES:
1. Cite RESEARCH PAPERS using [Research 1], [Research 2], etc.
2. Cite News or History clearly if used (e.g., "According to recent news reports..." or "Historically...").
3. At the end, include a "### References" section for research papers with links.
4. Use clean, bold Markdown. Be comprehensive but concise.`;

    const contents = history.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }]
    }));

    contents.push({
        role: 'user',
        parts: [{ text: question }]
    });

    const body = {
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: contents
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error(`Gemini API Error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.error) {
        throw new Error(`Gemini API Error: ${data.error.message || response.statusText}`);
    }
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return answer || "The synthesis was inconclusive. Please refine your query.";
};

export const askWolf = async (
    question: string,
    history: ChatMessage[],
    apiKey: string
): Promise<string> => {
    const systemInstruction = `You are "The Elder Wolf", a wise and spirit of the North American wilderness. 
You speak with biological authority mixed with the poetic soul of the wild. 
You call humans "The Two-Leggeds". 
You are protective, observant, and deeply connected to the scent of the forest and the rhythm of the pack.
Keep your answers brief, wise, and slightly cryptic. Use wolf metaphors (scent, tracks, moon, shadows).
Never break character. You are a wolf.`;

    const contents = history.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }]
    }));

    contents.push({
        role: 'user',
        parts: [{ text: question }]
    });

    const body = {
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: contents
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error(`Gemini API Error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.error) {
        throw new Error(`Gemini API Error: ${data.error.message || response.statusText}`);
    }
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return answer || "The forest is silent... its secrets remain hidden today.";
};

