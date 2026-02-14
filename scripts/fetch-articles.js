const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');
const slugify = require('slugify');
const cheerio = require('cheerio');

const parser = new Parser();
const FEED_URL = 'https://siliconandsoul.substack.com/feed';
const OUTPUT_DIR = path.join(__dirname, '../public/blog');

async function main() {
    console.log(`Fetching feed from ${FEED_URL}...`);
    try {
        const feed = await parser.parseURL(FEED_URL);
        console.log(`Found ${feed.items.length} articles.`);

        const articles = [];

        // Ensure output directory exists
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }

        for (const item of feed.items) {
            const title = item.title;
            const content = item['content:encoded'] || item.content;
            const date = item.isoDate; // Substack provides isoDate
            const link = item.link;

            // Generate slug
            const slug = slugify(title, { lower: true, strict: true });
            const filename = `${slug}.html`;
            const filePath = path.join(OUTPUT_DIR, filename);

            // Save article metadata for articles.js
            articles.push({
                date: date,
                title: title,
                link: `./${filename}`, // Point to local file
                originalLink: link,
                platform: 'Substack'
            });

            // Process content with Cheerio
            const $ = cheerio.load(content);

            // 1. Remove Subscribe Widgets
            $('.subscription-widget-wrap-editor').remove();

            // 2. Remove Share Buttons/Footer artifacts
            $('.share-dialog-title').remove();
            $('.share-dialog-container').remove();
            $('.comments-list-container').remove();

            // 3. Clean up Images - Remove the overlay buttons
            $('.image-link-expand').remove();
            $('figure').removeAttr('class'); // Remove substack classes

            // 4. Remove 'Direct Message' buttons
            $('.directMessage').remove();

            // 5. Fix links - Ensure external links open in new tab
            $('a').each((i, el) => {
                const href = $(el).attr('href');
                if (href && href.startsWith('http')) {
                    $(el).attr('target', '_blank');
                    $(el).attr('rel', 'noopener noreferrer');
                }
            });

            // 6. Style improvements
            $('blockquote').addClass('quote-style');

            const cleanContent = $('body').html();

            // Generate HTML content
            const htmlContent = generateHtml(title, date, cleanContent, link);

            // Write HTML file
            fs.writeFileSync(filePath, htmlContent);
            console.log(`Generated: ${filename}`);
        }

        // Generate articles.js
        const articlesJsContent = `const articles = ${JSON.stringify(articles, null, 4)};\n`;
        fs.writeFileSync(path.join(OUTPUT_DIR, 'articles.js'), articlesJsContent);
        console.log('Updated articles.js');

    } catch (error) {
        console.error('Error fetching/parsing feed:', error);
    }
}

function generateHtml(title, date, content, originalLink) {
    // Basic template based on public/blog/index.html structure
    // We navigate up one level for assets since we are in public/blog/
    const dateStr = new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title} | Sourav Tripathy</title>
    <link rel="stylesheet" href="../styles.css">
    <link rel="icon" href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYTM3ZjVmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTE4IDhoMWE0IDQgMCAwIDEgMCA4aC0xIi8+PHBhdGggZD0iTTIgOGgxNnY5YTQgNCAwIDAgMS00IDRINmE0IDQgMCAwIDEtNC00Vjh6Ii8+PGxpbmUgeDE9IjYiIHkxPSIxIiB4Mj0iNiIgeTI9IjQiLz48bGluZSB4MT0iMTAiIHkxPSIxIiB4Mj0iMTAiIHkyPSI0Ii8+PGxpbmUgeDE9IjE0IiB5MT0iMSIgeDI9IjE0IiB5Mj0iNCIvPjwvc3ZnPg==">
    <script>
        (function () {
            var theme = localStorage.getItem('theme');
            if (theme) {
                document.documentElement.setAttribute('data-theme', theme);
            } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
            }
        })();
    </script>
    <style>
        /* Article specific styles */
        .article-content {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem 0;
            line-height: 1.6;
            font-size: 1.1rem;
        }
        .article-content img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 1.5rem 0;
        }
        .article-content h1, .article-content h2, .article-content h3 {
            margin-top: 2rem;
            margin-bottom: 1rem;
            color: var(--highlight);
        }
        .article-content a {
            color: var(--highlight);
            text-decoration: underline;
        }
        .article-header {
            margin-bottom: 3rem;
            border-bottom: 1px dashed var(--dim);
            padding-bottom: 2rem;
        }
        .article-title {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            color: var(--fg);
            text-decoration: none;
        }
        .article-meta {
            color: var(--dim);
            font-size: 0.9rem;
        }
        .back-link {
            display: inline-block;
            margin-bottom: 2rem;
            color: var(--dim);
            text-decoration: none;
        }
        .back-link:hover {
            color: var(--highlight);
        }
        .article-content pre {
            background: var(--fg);
            color: var(--bg);
            padding: 1rem;
            border-radius: 5px;
            overflow-x: auto;
            margin: 1.5rem 0;
        }
        .article-content code {
            font-family: var(--font-mono);
            font-size: 0.9em;
            background: rgba(128, 128, 128, 0.1);
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
        }
        .article-content pre code {
            background: none;
            padding: 0;
            color: inherit;
        }
    </style>
</head>
<body>
    <div class="masthead">
        <div class="masthead-inner">
            <header class="site-header">
                <h1 class="brand-name">Sourav Tripathy</h1>
                <nav class="tabs">
                    <a href="/" class="tab-btn">About</a>
                    <a href="/blog/" class="tab-btn active">Blog</a>
                    <a href="/projects/" class="tab-btn">Projects</a>
                    <a href="/curations/" class="tab-btn">Curations</a>
                    <a href="/now/" class="tab-btn">Now</a>
                    <a href="/observatory/" class="tab-btn">Observatory</a>
                    <button class="theme-toggle" aria-label="Toggle dark mode" title="Toggle dark/light mode">
                 <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="5"></circle>
                            <line x1="12" y1="1" x2="12" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="23"></line>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                            <line x1="1" y1="12" x2="3" y2="12"></line>
                            <line x1="21" y1="12" x2="23" y2="12"></line>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                        </svg>
                        <svg class="icon-moon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                        </svg>
                    </button>
                </nav>
            </header>
        </div>
    </div>

    <div class="container">
        <main>
            <a href="/blog/" class="back-link">← Back to Blog</a>
            
            <article class="article-content">
                <header class="article-header">
                    <h1 class="article-title">${title}</h1>
                    <div class="article-meta">
                        Published on ${dateStr} • <a href="${originalLink}" target="_blank">Read on Substack</a>
                    </div>
                </header>
                
                <div class="article-body">
                    ${content}
                </div>
                
                <div class="subscribe-section" style="margin-top: 4rem; padding: 2rem; background: rgba(128, 128, 128, 0.05); border-radius: 8px; text-align: center;">
                    <p style="margin-bottom: 1rem; font-style: italic;">Enjoyed this piece? Subscribe for free to receive new posts and support my work.</p>
                    <a href="https://siliconandsoul.substack.com/subscribe" target="_blank" class="button primary" style="background: var(--highlight); color: var(--bg); padding: 0.8rem 1.5rem; border-radius: 4px; text-decoration: none; font-weight: bold; display: inline-block;">Subscribe on Substack</a>
                </div>
            </article>
        </main>

        <footer>
            <div class="social-links" style="margin-bottom: 2rem;">
              <a href="mailto:lipuntripathy74@gmail.com" target="_blank">Email</a>
                <a href="https://x.com/EssenceThinker" target="_blank">X (Twitter)</a>
                <a href="https://www.linkedin.com/in/sourav-tripathy-astrophile/" target="_blank">LinkedIn</a>
                <a href="https://github.com/Sourav-Tripathy" target="_blank">GitHub</a>
                <a href="https://letterboxd.com/essenceX/" target="_blank">Letterboxd</a>
                <a href="https://www.goodreads.com/user/show/82254166-sourav-tripathy" target="_blank">Goodreads</a>
            </div>
            © <span id="year"></span> Sourav Tripathy
        </footer>
    </div>
    <script src="../script.js"></script>
    <script>
        document.getElementById("year").textContent = new Date().getFullYear();
    </script>
</body>
</html>`;
}

main();
