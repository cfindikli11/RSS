import Parser from 'rss-parser';
import { Article, Feed } from '../models/index.js';
import config from '../config/config.js';
import { translateText } from './translationService.js';

const parser = new Parser({
    customFields: {
        item: [
            ['media:content', 'media_content', { keepArray: true }],
            ['media:thumbnail', 'media_thumbnail', { keepArray: true }],
            ['enclosure', 'enclosure', { keepArray: true }],
        ]
    },
    timeout: config.FEED_TIMEOUT,
});

// Extract image from RSS item
export function extractImage(item) {
    // 1. Try media:content
    if (item.media_content) {
        // Check for array or single object
        const media = Array.isArray(item.media_content) ? item.media_content : [item.media_content];
        for (const m of media) {
            if (m.$ && m.$.url && (m.$.medium === 'image' || !m.$.medium)) {
                return m.$.url;
            }
            if (m.url) return m.url;
        }
    }

    // 2. Try media:thumbnail
    if (item.media_thumbnail) {
        const thumbnails = Array.isArray(item.media_thumbnail) ? item.media_thumbnail : [item.media_thumbnail];
        for (const t of thumbnails) {
            if (t.$ && t.$.url) return t.$.url;
            if (t.url) return t.url;
        }
    }

    // 3. Try enclosure
    if (item.enclosure) {
        const enclosures = Array.isArray(item.enclosure) ? item.enclosure : [item.enclosure];
        for (const enc of enclosures) {
            if (enc.url && (!enc.type || enc.type.startsWith('image/'))) {
                return enc.url;
            }
            if (enc.$ && enc.$.url && (!enc.$.type || enc.$.type.startsWith('image/'))) {
                return enc.$.url;
            }
        }
    }

    // 4. Try finding <img> tag in content/description/summary
    const content = item['content:encoded'] || item.content || item.description || item.summary || '';

    // Look for src attribute in img tag
    // Handles both single and double quotes, and various attributes order
    const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
    if (imgMatch && imgMatch[1]) {
        return imgMatch[1];
    }

    // 5. Try image field (some feeds use this)
    if (item.image && item.image.url) {
        return item.image.url;
    }

    return null;
}

// Calculate reading time (words per minute = 200)
export function calculateReadingTime(text) {
    const words = text.split(/\s+/).length;
    return Math.ceil(words / 200) * 60; // return in seconds
}

// Fetch and parse a single feed
export async function fetchFeed(feed) {
    try {
        console.log(`Fetching feed: ${feed.name} (${feed.url})`);

        const parsedFeed = await parser.parseURL(feed.url);
        const articles = [];

        for (const item of parsedFeed.items.slice(0, 10)) {
            try {
                let title = item.title || 'Untitled';
                let summary = (item.contentSnippet || item.summary || item.description || '').substring(0, 300);

                // Translate if English
                if (feed.language === 'en') {
                    [title, summary] = await Promise.all([
                        translateText(title),
                        translateText(summary),
                    ]);
                }

                const articleData = {
                    feedId: feed.id,
                    title,
                    url: item.link || item.guid,
                    summary: summary + '...',
                    content: item.content || item['content:encoded'] || summary,
                    imageUrl: extractImage(item),
                    category: feed.category,
                    source: feed.name,
                    publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
                    readingTime: calculateReadingTime(item.content || item.contentSnippet || ''),
                };

                articles.push(articleData);
            } catch (itemError) {
                console.error(`Error processing item from ${feed.name}:`, itemError.message);
            }
        }

        // Update feed status
        await feed.update({
            lastFetched: new Date(),
            lastSuccess: new Date(),
            errorCount: 0,
            lastError: null,
        });

        return articles;
    } catch (error) {
        console.error(`Error fetching feed ${feed.name}:`, error.message);

        // Update feed error status
        await feed.update({
            lastFetched: new Date(),
            errorCount: feed.errorCount + 1,
            lastError: error.message,
        });

        return [];
    }
}

// Fetch all active feeds and save articles
export async function fetchAllFeeds() {
    console.log(`[${new Date().toISOString()}] Starting feed refresh...`);

    try {
        const feeds = await Feed.findAll({ where: { isActive: true } });
        console.log(`Found ${feeds.length} active feeds`);

        const allArticlesPromises = feeds.map(feed => fetchFeed(feed));
        const allArticlesArrays = await Promise.all(allArticlesPromises);
        const allArticles = allArticlesArrays.flat();

        console.log(`Fetched ${allArticles.length} articles total`);

        // Save or update articles in database
        let savedCount = 0;
        let updatedCount = 0;

        for (const articleData of allArticles) {
            try {
                const [article, created] = await Article.findOrCreate({
                    where: { url: articleData.url },
                    defaults: articleData,
                });

                if (!created) {
                    // Update existing article
                    await article.update(articleData);
                    updatedCount++;
                } else {
                    savedCount++;
                }
            } catch (error) {
                console.error(`Error saving article ${articleData.url}:`, error.message);
            }
        }

        console.log(`[${new Date().toISOString()}] Feed refresh complete. New: ${savedCount}, Updated: ${updatedCount}`);

        return { total: allArticles.length, saved: savedCount, updated: updatedCount };
    } catch (error) {
        console.error('Error in fetchAllFeeds:', error);
        throw error;
    }
}

export default {
    fetchFeed,
    fetchAllFeeds,
    extractImage,
    calculateReadingTime,
};
