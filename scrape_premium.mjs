import fs from 'fs';

async function scrapePremium() {
    console.log("Commencing High-Quality Research Scrape for Canidae Science...");

    const targetDir = './src/data';
    const existingPapers = JSON.parse(fs.readFileSync(`${targetDir}/papers.json`, 'utf8'));
    const existingIds = new Set(existingPapers.map(p => p.paperId));

    const queries = [
        'trophic cascades wolves',
        'canis lupus genetics',
        'canis latrans behavioral ecology',
        'canis rufus recovery',
        'vulpes vulpes urban adaptation',
        'canid social evolution',
        'interspecific competition canids',
        'mesopredator release coyote',
        'wolf reintroduction yellowstone'
    ];

    let newPapers = [];

    const fetchPlos = async (q) => {
        const url = `https://api.plos.org/search?q=everything:${encodeURIComponent(q)}&wt=json&fl=id,title_display,author_display,abstract,publication_date,journal&rows=100`;
        try {
            const res = await fetch(url);
            if (!res.ok) return [];
            const json = await res.json();
            return json.response?.docs || [];
        } catch (e) {
            return [];
        }
    };

    for (const q of queries) {
        console.log(`Searching for: ${q}...`);
        const docs = await fetchPlos(q);
        for (const doc of docs) {
            if (!doc.abstract || doc.abstract.length === 0) continue;
            if (!existingIds.has(doc.id)) {
                newPapers.push({
                    paperId: doc.id,
                    title: doc.title_display,
                    abstract: (Array.isArray(doc.abstract) ? doc.abstract.join(' ') : doc.abstract).replace(/\n/g, ' ').trim(),
                    authors: (doc.author_display || []).map(a => ({ name: a })),
                    year: doc.publication_date ? new Date(doc.publication_date).getFullYear() : null,
                    url: `https://journals.plos.org/plosone/article?id=${doc.id}`,
                    venue: doc.journal || 'Research Archive'
                });
                existingIds.add(doc.id);
            }
        }
        await new Promise(r => setTimeout(r, 500));
    }

    const finalLibrary = [...existingPapers, ...newPapers].sort((a, b) => (b.year || 0) - (a.year || 0));
    fs.writeFileSync(`${targetDir}/papers.json`, JSON.stringify(finalLibrary, null, 2));

    console.log(`\n================================`);
    console.log(`SUCCESS! Library expanded with ${newPapers.length} new high-quality items.`);
    console.log(`Total count: ${finalLibrary.length}`);
    console.log(`================================\n`);
}

scrapePremium();
