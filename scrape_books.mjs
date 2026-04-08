import fs from 'fs';

async function scrapeBooksForCanids() {
    console.log("Scraping Google Books API for a vast library of wild canid books...");

    const queries = [
        'wolves ecology',
        'coyotes urban adaptation',
        'red wolf conservation',
        'canid social behavior',
        'foxes habitats',
        'wolves biology',
        'dog evolution from wolves'
    ];

    const uniqueBooks = [];
    const seenIds = new Set();

    for (const q of queries) {
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=40&langRestrict=en`;

        try {
            const res = await fetch(url);
            if (!res.ok) {
                console.error(`HTTP Error for query "${q}": ${res.status}`);
                continue;
            }

            const json = await res.json();
            const items = json.items || [];
            console.log(`Found ${items.length} books for query: "${q}"`);

            for (const item of items) {
                const info = item.volumeInfo;
                if (!info || !info.description) continue; // Need description to mimic an abstract

                const cleanAbstract = info.description.replace(/\n/g, ' ').trim();
                const lowerAbs = cleanAbstract.toLowerCase();

                // Filter out completely unrelated books
                if (!lowerAbs.includes('wolf') && !lowerAbs.includes('wolves') && !lowerAbs.includes('coyote') && !lowerAbs.includes('canid') && !lowerAbs.includes('fox')) {
                    continue;
                }

                if (item.id && !seenIds.has(item.id)) {
                    seenIds.add(item.id);
                    uniqueBooks.push({
                        paperId: `book-${item.id}`,
                        title: info.title,
                        abstract: cleanAbstract,
                        authors: (info.authors || []).map(a => ({ name: a })),
                        year: info.publishedDate ? parseInt(info.publishedDate.substring(0, 4)) : null,
                        url: info.infoLink || `https://books.google.com/books?id=${item.id}`,
                        venue: info.publisher ? `Book: ${info.publisher}` : 'Book'
                    });
                }
            }
        } catch (error) {
            console.error(`Failed to scrape books for query "${q}":`, error.message);
        }
        await new Promise(r => setTimeout(r, 1000)); // Be polite to the API
    }

    // Sort by newest
    uniqueBooks.sort((a, b) => (b.year || 0) - (a.year || 0));

    // Merge with existing papers
    const targetDir = './src/data';
    const papersPath = `${targetDir}/papers.json`;
    let existingData = [];
    if (fs.existsSync(papersPath)) {
        const rawData = fs.readFileSync(papersPath);
        existingData = JSON.parse(rawData);
    }

    // Combine effectively
    const combined = [...existingData, ...uniqueBooks];

    fs.writeFileSync(papersPath, JSON.stringify(combined, null, 2));

    console.log(`\n================================`);
    console.log(`SUCCESS! Added ${uniqueBooks.length} books. Total library size is now ${combined.length} items in papers.json`);
    console.log(`================================\n`);
}

scrapeBooksForCanids();
