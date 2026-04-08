import fs from 'fs';

async function scrapeEverything() {
    console.log("Commencing Mega-Scrape for 2000+ Canid research documents...");

    const targetDir = './src/data';
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir);
    }

    const keywords = [
        'wolf ecology', 'gray wolf reintroduction', 'mexican wolf genetics',
        'coyote urban behavior', 'coyote population dynamics',
        'red wolf conservation', 'canis rufus habitat',
        'canis latrans range expansion', 'wild canid social structure',
        'fox behavioral ecology', 'vulpes vulpes habitat',
        'african wild dog hunting', 'lycaon pictus',
        'ethiopian wolf conservation', 'canis simensis',
        'jackal ecology', 'dingo management australia',
        'dhole conservation india', 'canid evolutionary history',
        'predatory behavior canids'
    ];

    let allPapersMap = new Map();

    const fetchPlos = async (query, start = 0) => {
        const url = `https://api.plos.org/search?q=everything:${encodeURIComponent(query)}&wt=json&fl=id,title_display,author_display,abstract,publication_date,journal&rows=100&start=${start}`;
        try {
            const res = await fetch(url);
            if (!res.ok) return [];
            const json = await res.json();
            return json.response?.docs || [];
        } catch (e) {
            return [];
        }
    };

    // 1. PLOS Mega Fetch
    for (const kw of keywords) {
        console.log(`Searching PLOS for: ${kw}...`);
        for (let i = 0; i < 2; i++) { // Fetch 2 pages (200 docs) per keyword
            const docs = await fetchPlos(kw, i * 100);
            if (docs.length === 0) break;

            for (const doc of docs) {
                if (!doc.abstract || doc.abstract.length === 0) continue;
                const cleanAbstract = Array.isArray(doc.abstract) ? doc.abstract.join(' ') : doc.abstract;

                // Keep only relevant
                const lowerTxt = (doc.title_display + " " + cleanAbstract).toLowerCase();
                const identifies = /\b(wolf|wolves|coyote|canid|fox|jackal|dingo|dhole|lycaon|canis)\b/i.test(lowerTxt);

                if (identifies && !allPapersMap.has(doc.id)) {
                    allPapersMap.set(doc.id, {
                        paperId: doc.id,
                        title: doc.title_display,
                        abstract: cleanAbstract.replace(/\n/g, ' ').trim(),
                        authors: (doc.author_display || []).map(a => ({ name: a })),
                        year: doc.publication_date ? new Date(doc.publication_date).getFullYear() : null,
                        url: `https://journals.plos.org/plosone/article?id=${doc.id}`,
                        venue: doc.journal || 'PLOS'
                    });
                }
            }
            if (allPapersMap.size > 2500) break;
            await new Promise(r => setTimeout(r, 200)); // Rate limiting safety
        }
        if (allPapersMap.size > 2500) break;
    }

    // 2. Google Books Fallback/Add-on (using the script logic but safer)
    console.log(`Currently at ${allPapersMap.size} documents. Augmenting with Books...`);
    const bookQueries = ['wolves biology', 'coyotes North America', 'The Red Wolf Conspiracy', 'Wild Canids behavior'];
    for (const q of bookQueries) {
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=40&langRestrict=en`;
        try {
            const res = await fetch(url);
            if (!res.ok) continue;
            const json = await res.json();
            const items = json.items || [];
            for (const item of items) {
                const info = item.volumeInfo;
                if (!info || !info.description) continue;
                if (!allPapersMap.has(item.id)) {
                    allPapersMap.set(item.id, {
                        paperId: `book-${item.id}`,
                        title: info.title,
                        abstract: info.description.replace(/\n/g, ' ').trim(),
                        authors: (info.authors || []).map(a => ({ name: a })),
                        year: info.publishedDate ? parseInt(info.publishedDate.substring(0, 4)) : null,
                        url: info.infoLink || `https://books.google.com/books?id=${item.id}`,
                        venue: info.publisher ? `Book: ${info.publisher}` : 'Reference Book'
                    });
                }
            }
        } catch (e) { }
        await new Promise(r => setTimeout(r, 1000));
    }

    const finalArray = Array.from(allPapersMap.values());
    finalArray.sort((a, b) => (b.year || 0) - (a.year || 0));

    fs.writeFileSync(`${targetDir}/papers.json`, JSON.stringify(finalArray, null, 2));

    console.log(`\n================================`);
    console.log(`SUCCESS! Total library size: ${finalArray.length} documents.`);
    console.log(`================================\n`);
}

scrapeEverything();
