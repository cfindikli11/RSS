const express = require('express');
const Parser = require('rss-parser');
const { translate } = require('@vitalets/google-translate-api');
const path = require('path');

const app = express();
const parser = new Parser({
    customFields: {
        item: [
            ['media:content', 'media_content', { keepArray: true }],
            ['media:thumbnail', 'media_thumbnail', { keepArray: true }],
            ['enclosure', 'enclosure', { keepArray: true }],
        ]
    }
});

const PORT = process.env.PORT || 3000;

// Feeds Configuration
const FEEDS = [
    { url: "https://feeds.bbci.co.uk/turkce/rss.xml", category: "Dünya", source: "BBC Türkçe", lang: "tr" },
    { url: "https://www.aa.com.tr/tr/rss/default?cat=guncel", category: "Gündem", source: "Anadolu Ajansı", lang: "tr" },
    { url: "https://webrazzi.com/feed", category: "Teknoloji", source: "Webrazzi", lang: "tr" },
    { url: "https://shiftdelete.net/feed", category: "Teknoloji", source: "ShiftDelete", lang: "tr" },
    { url: "https://www.bloomberght.com/rss", category: "Ekonomi", source: "Bloomberg HT", lang: "tr" },
    { url: "https://evrimagaci.org/rss.xml", category: "Bilim", source: "Evrim Ağacı", lang: "tr" },
    { url: "http://feeds.bbci.co.uk/news/world/rss.xml", category: "Dünya", source: "BBC World", lang: "en" },
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml", category: "Dünya", source: "NYT", lang: "en" },
    { url: "http://rss.cnn.com/rss/edition.rss", category: "Dünya", source: "CNN", lang: "en" },
    { url: "https://www.aljazeera.com/xml/rss/all.xml", category: "Dünya", source: "Al Jazeera", lang: "en" },
    { url: "https://techcrunch.com/feed/", category: "Teknoloji", source: "TechCrunch", lang: "en" },
    { url: "https://www.theverge.com/rss/index.xml", category: "Teknoloji", source: "The Verge", lang: "en" },
    { url: "https://feeds.bloomberg.com/markets/news.rss", category: "Ekonomi", source: "Bloomberg", lang: "en" },
    { url: "https://www.wired.com/feed/rss", category: "Bilim", source: "Wired", lang: "en" },
];

// Cache Configuration
let newsCache = {
    data: [],
    lastUpdated: 0
};
const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes

// Static Files
app.use(express.static('templates')); // Serving templates as static for simplicity, or we can use a view engine. 
// Wait, the python app used `render_template`. I should probably just serve the static HTML file for `/`.
// But the HTML is in `templates/index.html`. I'll serve that.

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

// Helper: Extract Image
function extractImage(item) {
    // 1. media:content
    if (item.media_content) {
        for (const media of item.media_content) {
            if (media.$ && media.$.url) return media.$.url;
        }
    }

    // 2. media:thumbnail
    if (item.media_thumbnail) {
        for (const media of item.media_thumbnail) {
            if (media.$ && media.$.url) return media.$.url;
        }
    }

    // 3. Enclosure
    if (item.enclosure) {
        for (const enc of item.enclosure) {
            if (enc.$ && enc.$.type && enc.$.type.startsWith('image/')) return enc.$.url;
        }
    }

    // 4. Regex in content
    const content = item['content:encoded'] || item.content || item.summary || item.description || '';
    const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/);
    if (imgMatch) return imgMatch[1];

    return null;
}

// Helper: Translate
async function translateText(text) {
    try {
        const res = await translate(text, { to: 'tr' });
        return res.text;
    } catch (e) {
        console.error("Translation error:", e.message);
        return text;
    }
}

// Background Job: Fetch News
async function fetchAndCacheNews() {
    console.log(`[${new Date().toISOString()}] Starting background job: Fetching fresh news...`);

    const promises = FEEDS.map(async (feedInfo) => {
        try {
            const feed = await parser.parseURL(feedInfo.url);
            // Process top 5 items
            const items = await Promise.all(feed.items.slice(0, 5).map(async (item) => {
                let title = item.title || 'Başlıksız';
                let summary = (item.contentSnippet || item.summary || item.content || '').substring(0, 200) + '...';

                // Translate if needed
                if (feedInfo.lang === 'en') {
                    [title, summary] = await Promise.all([
                        translateText(title),
                        translateText(summary)
                    ]);
                }

                return {
                    title: title,
                    link: item.link,
                    summary: summary,
                    published: item.pubDate, // ISO string usually
                    timestamp: new Date(item.pubDate).getTime(),
                    source: feedInfo.source,
                    category: feedInfo.category,
                    image: extractImage(item)
                };
            }));
            return items;
        } catch (e) {
            console.error(`Error fetching ${feedInfo.url}:`, e.message);
            return [];
        }
    });

    const results = await Promise.all(promises);
    const allNews = results.flat();

    // Sort by date
    allNews.sort((a, b) => b.timestamp - a.timestamp);

    // Update cache
    newsCache.data = allNews;
    newsCache.lastUpdated = Date.now();

    console.log(`[${new Date().toISOString()}] Background job finished. Cache updated with ${allNews.length} items.`);
}

// Start Background Job
fetchAndCacheNews(); // Initial fetch
setInterval(fetchAndCacheNews, REFRESH_INTERVAL); // Repeat every 15 mins

// API Endpoint
app.get('/api/news', (req, res) => {
    // Return cached data immediately
    res.json(newsCache.data);
});

app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});
