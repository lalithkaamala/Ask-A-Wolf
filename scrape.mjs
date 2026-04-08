import fs from 'fs';

const queries = [
    'wolves behavior north america',
    'coyote range expansion urban',
    'wild canids ecology',
    'Canis lupus Yellowstone',
    'Canis latrans diet urban',
    'red wolf conservation Canis rufus',
    'gray wolf pack dynamics',
    'coyote human wildlife conflict',
    'canid disease outbreaks wolves',
    'wolf reintroduction ecology',
    'canid hybridization coyote wolf',
    'canid spatial ecology movement',
    'coyote predation mesopredator release',
    'wolf deer elk predator prey',
    'canid genetic structure diversity'
];

const ALL_PAPERS = [];

async function scrapeAndStore() {
    console.log("Scraping Semantic Scholar for a VAST library of wild canid papers...");

    for (const q of queries) {
        let retries = 3;
        let success = false;

        while (retries > 0 && !success) {
            try {
                // Request 100 papers per query
                const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(q)}&limit=100&fields=title,authors,year,abstract,url,venue`;
                console.log(`Fetching: "${q}"...`);
                const res = await fetch(url);

                if (!res.ok) {
                    if (res.status === 429) {
                        console.warn(`Rate limited (429) for "${q}". Waiting 5 seconds before retry...`);
                        await new Promise(r => setTimeout(r, 5000));
                        retries--;
                        continue;
                    } else {
                        console.error(`Error for ${q}: ${res.status} ${res.statusText}`);
                        break; // Break retry loop on non-429 errors
                    }
                }

                const json = await res.json();
                console.log(`Found ${json.data?.length || 0} papers for "${q}"`);
                if (json.data) {
                    ALL_PAPERS.push(...json.data);
                }
                success = true;

            } catch (e) {
                console.error(`Failed to fetch for ${q}`, e.message);
                retries--;
                await new Promise(r => setTimeout(r, 5000));
            }
        }

        // Polite delay between queries to avoid hitting rate limit
        await new Promise(r => setTimeout(r, 3000));
    }

    const uniquePapers = [];
    const seenIds = new Set();

    // Deduplicate and filter out papers without abstracts
    for (const p of ALL_PAPERS) {
        if (p.paperId && !seenIds.has(p.paperId) && p.abstract) {
            seenIds.add(p.paperId);
            uniquePapers.push(p);
        }
    }

    // Sort by year descending (newest first)
    uniquePapers.sort((a, b) => (b.year || 0) - (a.year || 0));

    const targetDir = './src/data';
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir);
    }

    fs.writeFileSync(`${targetDir}/papers.json`, JSON.stringify(uniquePapers, null, 2));
    console.log(`\n================================`);
    console.log(`SUCCESS! Stored ${uniquePapers.length} unique papers with abstracts in src/data/papers.json`);
    console.log(`================================\n`);
}

scrapeAndStore();
