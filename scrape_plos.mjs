import fs from 'fs';

async function scrapePlosForCanids() {
    console.log("Scraping PLOS API for a vast library of wild canid papers...");

    const url = `https://api.plos.org/search?q=abstract:wolf%20OR%20abstract:coyote%20OR%20abstract:canid&wt=json&fl=id,title_display,author_display,abstract,publication_date,journal&rows=500`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`HTTP Error: ${res.status}`);
        }

        const json = await res.json();
        const docs = json.response?.docs || [];
        console.log(`Found ${docs.length} papers from PLOS.`);

        const uniquePapers = [];

        for (const doc of docs) {
            if (!doc.abstract || doc.abstract.length === 0) continue;

            const cleanAbstract = Array.isArray(doc.abstract) ? doc.abstract.join(' ') : doc.abstract;

            // Filter out some completely unrelated papers if any sneaked in
            const lowerAbs = cleanAbstract.toLowerCase();
            if (!lowerAbs.includes('wolf') && !lowerAbs.includes('wolves') && !lowerAbs.includes('coyote') && !lowerAbs.includes('canid')) {
                continue;
            }

            uniquePapers.push({
                paperId: doc.id,
                title: doc.title_display,
                abstract: cleanAbstract.replace(/\n/g, ' ').trim(),
                authors: (doc.author_display || []).map(a => ({ name: a })),
                year: doc.publication_date ? new Date(doc.publication_date).getFullYear() : null,
                url: `https://journals.plos.org/plosone/article?id=${doc.id}`,
                venue: doc.journal || 'PLOS ONE'
            });
        }

        // Sort by newest
        uniquePapers.sort((a, b) => (b.year || 0) - (a.year || 0));

        const targetDir = './src/data';
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir);
        }

        fs.writeFileSync(`${targetDir}/papers.json`, JSON.stringify(uniquePapers, null, 2));

        console.log(`\n================================`);
        console.log(`SUCCESS! Stored ${uniquePapers.length} curated papers with full abstracts in src/data/papers.json`);
        console.log(`================================\n`);

    } catch (error) {
        console.error("Failed to scrape PLOS:", error);
    }
}

scrapePlosForCanids();
