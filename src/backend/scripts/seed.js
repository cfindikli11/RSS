import { Feed } from '../models/index.js';
import { syncDatabase } from '../config/database.js';

// Default feeds to seed the database
const defaultFeeds = [
    { name: 'BBC Türkçe', url: 'https://feeds.bbci.co.uk/turkce/rss.xml', category: 'Dünya', language: 'tr', isDefault: true },
    { name: 'Anadolu Ajansı', url: 'https://www.aa.com.tr/tr/rss/default?cat=guncel', category: 'Gündem', language: 'tr', isDefault: true },
    { name: 'Webrazzi', url: 'https://webrazzi.com/feed', category: 'Teknoloji', language: 'tr', isDefault: true },
    { name: 'ShiftDelete', url: 'https://shiftdelete.net/feed', category: 'Teknoloji', language: 'tr', isDefault: true },
    { name: 'Bloomberg HT', url: 'https://www.bloomberght.com/rss', category: 'Ekonomi', language: 'tr', isDefault: true },
    { name: 'Evrim Ağacı', url: 'https://evrimagaci.org/rss.xml', category: 'Bilim', language: 'tr', isDefault: true },
    { name: 'BBC World', url: 'http://feeds.bbci.co.uk/news/world/rss.xml', category: 'Dünya', language: 'en', isDefault: true },
    { name: 'NYT', url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', category: 'Dünya', language: 'en', isDefault: true },
    { name: 'CNN', url: 'http://rss.cnn.com/rss/edition.rss', category: 'Dünya', language: 'en', isDefault: true },
    { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', category: 'Dünya', language: 'en', isDefault: true },
    { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', category: 'Teknoloji', language: 'en', isDefault: true },
    { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', category: 'Teknoloji', language: 'en', isDefault: true },
    { name: 'Bloomberg', url: 'https://feeds.bloomberg.com/markets/news.rss', category: 'Ekonomi', language: 'en', isDefault: true },
    { name: 'Wired', url: 'https://www.wired.com/feed/rss', category: 'Bilim', language: 'en', isDefault: true },
];

async function seedFeeds() {
    console.log('🌱 Seeding default feeds...');

    try {
        // Ensure database tables exist
        console.log('📋 Syncing database...');
        await syncDatabase({ alter: true });

        for (const feedData of defaultFeeds) {
            const [feed, created] = await Feed.findOrCreate({
                where: { url: feedData.url },
                defaults: feedData,
            });

            if (created) {
                console.log(`✅ Created feed: ${feed.name}`);
            } else {
                console.log(`⏭️  Feed already exists: ${feed.name}`);
            }
        }

        console.log('🎉 Seed complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
}

seedFeeds();
