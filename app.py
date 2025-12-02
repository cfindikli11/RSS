from flask import Flask, render_template, jsonify
import feedparser
from dateutil import parser as date_parser
import time
from concurrent.futures import ThreadPoolExecutor

app = Flask(__name__)

from deep_translator import GoogleTranslator

# Curated list of "Important" feeds
FEEDS = [
    # Turkish Sources
    {"url": "https://feeds.bbci.co.uk/turkce/rss.xml", "category": "Dünya", "source": "BBC Türkçe", "lang": "tr"},
    {"url": "https://www.aa.com.tr/tr/rss/default?cat=guncel", "category": "Gündem", "source": "Anadolu Ajansı", "lang": "tr"},
    {"url": "https://webrazzi.com/feed", "category": "Teknoloji", "source": "Webrazzi", "lang": "tr"},
    {"url": "https://shiftdelete.net/feed", "category": "Teknoloji", "source": "ShiftDelete", "lang": "tr"},
    {"url": "https://www.bloomberght.com/rss", "category": "Ekonomi", "source": "Bloomberg HT", "lang": "tr"},
    {"url": "https://evrimagaci.org/rss.xml", "category": "Bilim", "source": "Evrim Ağacı", "lang": "tr"},
    
    # International Sources (to be translated)
    {"url": "http://feeds.bbci.co.uk/news/world/rss.xml", "category": "Dünya", "source": "BBC World", "lang": "en"},
    {"url": "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml", "category": "Dünya", "source": "NYT", "lang": "en"},
    {"url": "http://rss.cnn.com/rss/edition.rss", "category": "Dünya", "source": "CNN", "lang": "en"},
    {"url": "https://www.aljazeera.com/xml/rss/all.xml", "category": "Dünya", "source": "Al Jazeera", "lang": "en"},
    {"url": "https://techcrunch.com/feed/", "category": "Teknoloji", "source": "TechCrunch", "lang": "en"},
    {"url": "https://www.theverge.com/rss/index.xml", "category": "Teknoloji", "source": "The Verge", "lang": "en"},
    {"url": "https://feeds.bloomberg.com/markets/news.rss", "category": "Ekonomi", "source": "Bloomberg", "lang": "en"},
    {"url": "https://www.wired.com/feed/rss", "category": "Bilim", "source": "Wired", "lang": "en"},
]

import re

def translate_text(text):
    try:
        return GoogleTranslator(source='auto', target='tr').translate(text)
    except:
        return text

def parse_feed(feed_info):
    try:
        feed = feedparser.parse(feed_info["url"])
        entries = []
        # Limit to 5 items per feed to keep translation fast
        for entry in feed.entries[:5]: 
            image_url = None
            
            # 1. Check media_content
            if 'media_content' in entry:
                # Find the biggest image or the one with 'medium' attribute
                for media in entry.media_content:
                    if 'url' in media:
                        image_url = media['url']
                        # Prefer medium/large if specified, or just take the first one that looks like an image
                        if 'medium' in media and media['medium'] == 'image':
                            break
            
            # 2. Check media_thumbnail
            if not image_url and 'media_thumbnail' in entry:
                image_url = entry.media_thumbnail[0]['url']
                
            # 3. Check links (enclosures)
            if not image_url and 'links' in entry:
                for link in entry.links:
                    if link.rel == 'enclosure' and link.type.startswith('image/'):
                        image_url = link.href
                        break
            
            # 4. Check content/summary for <img> tags
            if not image_url:
                content = ''
                if 'content' in entry:
                    content = entry.content[0].value
                elif 'summary' in entry:
                    content = entry.summary
                
                # Simple regex to find the first image src
                img_match = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', content)
                if img_match:
                    image_url = img_match.group(1)

            # Parse date
            published = entry.get('published', '')
            timestamp = 0
            try:
                if published:
                    dt = date_parser.parse(published)
                    timestamp = dt.timestamp()
            except:
                pass
            
            title = entry.get('title', 'Başlıksız')
            summary = entry.get('summary', '')[:200] + '...'
            
            # Translate if needed
            if feed_info.get("lang") == "en":
                try:
                    title = translate_text(title)
                    summary = translate_text(summary)
                except Exception as e:
                    print(f"Translation error: {e}")

            entries.append({
                "title": title,
                "link": entry.get('link', '#'),
                "summary": summary, # Truncate summary
                "published": published,
                "timestamp": timestamp,
                "source": feed_info["source"],
                "category": feed_info["category"],
                "image": image_url
            })
        return entries
    except Exception as e:
        print(f"Error parsing {feed_info['url']}: {e}")
        return []

# Cache configuration
CACHE_TIMEOUT = 300  # 5 minutes
news_cache = {
    "data": [],
    "last_updated": 0
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/news')
def get_news():
    global news_cache
    current_time = time.time()
    
    # Check cache
    if current_time - news_cache["last_updated"] < CACHE_TIMEOUT and news_cache["data"]:
        print("Serving from cache")
        return jsonify(news_cache["data"])
        
    print("Fetching fresh data...")
    news = []
    with ThreadPoolExecutor(max_workers=5) as executor:
        results = executor.map(parse_feed, FEEDS)
        for result in results:
            news.extend(result)
    
    # Sort by newest first
    news.sort(key=lambda x: x['timestamp'], reverse=True)
    
    # Update cache
    news_cache["data"] = news
    news_cache["last_updated"] = current_time
    
    return jsonify(news)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
