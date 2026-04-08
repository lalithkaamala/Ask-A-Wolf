import fs from 'fs';

async function scrapeUltra() {
    console.log("Commencing Ultra-Scale Scrape for 2000+ Canid research documents...");

    const targetDir = './src/data';
    const majorSpecies = [
        'wolf', 'wolves', 'coyote', 'coyotes', 'fox', 'foxes',
        'gray wolf', 'mexican wolf', 'red wolf', 'jackal',
        'dingo', 'wild dog', 'canid', 'vulpine', 'canis lupus',
        'canis latrans', 'lycaon pictus', 'dhole', 'feral dog'
    ];

    let allPapersMap = new Map();

    const fetchInBulk = async (species, retries = 3) => {
        const url = `https://api.plos.org/search?q=everything:${encodeURIComponent(species)}&wt=json&fl=id,title_display,author_display,abstract,publication_date,journal&rows=1000`;
        
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const res = await fetch(url);
                if (!res.ok) {
                    if (res.status === 429) {
                        console.warn(`    [!] Rate limited (429). Retrying in 2s... (Attempt ${attempt}/${retries})`);
                        await new Promise(r => setTimeout(r, 2000 * attempt));
                        continue;
                    }
                    console.error(`    [!] HTTP Error: ${res.status} for ${species}`);
                    return 0;
                }
                const json = await res.json();
                const docs = json.response?.docs || [];

                let addedCount = 0;
                for (const doc of docs) {
                    if (!doc.abstract || doc.abstract.length < 50) continue; // Filter out short/missing abstracts
                    if (!allPapersMap.has(doc.id)) {
                        allPapersMap.set(doc.id, {
                            paperId: doc.id,
                            title: doc.title_display,
                            abstract: (Array.isArray(doc.abstract) ? doc.abstract.join(' ') : doc.abstract).replace(/\n/g, ' ').trim(),
                            authors: (doc.author_display || []).map(a => ({ name: a })),
                            year: doc.publication_date ? new Date(doc.publication_date).getFullYear() : null,
                            url: `https://journals.plos.org/plosone/article?id=${doc.id}`,
                            venue: doc.journal || 'Research Archive'
                        });
                        addedCount++;
                    }
                }
                return addedCount;
            } catch (e) {
                console.warn(`    [!] Fetch failure for ${species}: ${e.message}. Retrying... (${attempt}/${retries})`);
                await new Promise(r => setTimeout(r, 1000 * attempt));
            }
        }
        return 0;
    };

    for (const species of majorSpecies) {
        console.log(`Deep searching for: ${species}...`);
        const count = await fetchInBulk(species);
        console.log(`Fetched ${count} unique records for ${species}. Current Total: ${allPapersMap.size}`);
        if (allPapersMap.size > 2200) break;
        await new Promise(r => setTimeout(r, 500));
    }

    const finalArray = Array.from(allPapersMap.values());
    finalArray.sort((a, b) => (b.year || 0) - (a.year || 0));

    fs.writeFileSync(`${targetDir}/papers.json`, JSON.stringify(finalArray, null, 2));

    console.log(`\n================================`);
    console.log(`SUCCESS! Massive Library established with ${finalArray.length} items.`);
    console.log(`================================\n`);
}

scrapeUltra();
