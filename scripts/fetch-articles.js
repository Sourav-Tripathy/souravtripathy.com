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

        // Load existing articles
        const articlesJsPath = path.join(OUTPUT_DIR, 'articles.js');
        let existingArticles = [];
        if (fs.existsSync(articlesJsPath)) {
            try {
                const content = fs.readFileSync(articlesJsPath, 'utf8');
                const jsonMatch = content.match(/const articles = (\[[\s\S]*?\]);/);
                if (jsonMatch) {
                    existingArticles = JSON.parse(jsonMatch[1]);
                }
            } catch (e) {
                console.error("Failed to parse existing articles.js:", e);
            }
        }

        // Helper to determine the default tags based on the title
        function getDefaultTags(title) {
            const t = title.toLowerCase();
            if (t.includes("distributed llm inference") || 
                t.includes("swallowed route") || 
                t.includes("continual learning") || 
                t.includes("eigenvectors") || 
                t.includes("knowledge distillation") || 
                t.includes("lora and qlora") || 
                t.includes("word square") || 
                t.includes("vectors, matrices") || 
                t.includes("power of attention") || 
                t.includes("vector voodoo") ||
                t.includes("entropy") ||
                t.includes("scientific experiments") ||
                t.includes("quantum physics") ||
                t.includes("linear regression") ||
                t.includes("compute") || t.includes("memory") ||
                t.includes("llm") || t.includes("ai") || t.includes("model") || t.includes("network") || t.includes("fastapi") || t.includes("code") || t.includes("vector") || t.includes("matrix") || t.includes("programming") || t.includes("algorithm") || t.includes("inference")) {
                return ["Tech"];
            }
            if (t.includes("elegy") || 
                t.includes("fallen flowers") || 
                t.includes("whispers of rain") || 
                t.includes("kite") || 
                t.includes("poem") || t.includes("poetry") || t.includes("song") || t.includes("verse") || t.includes("rain")) {
                return ["Poetry"];
            }
            if (t.includes("stardust") || t.includes("story") || t.includes("whisper")) {
                return ["Short Story (Fiction)"];
            }
            return ["Reflections"];
        }

        const articlesMap = new Map();
        existingArticles.forEach(art => {
            articlesMap.set(art.title.toLowerCase().trim(), art);
        });

        // Ensure output directory exists
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }

        for (const item of feed.items) {
            const title = item.title;
            const content = item['content:encoded'] || item.content;
            const subtitle = item.contentSnippet || ""; // Substack subtitle is usually in description
            const date = item.isoDate; // Substack provides isoDate
            const link = item.link;

            // Generate slug
            const slug = slugify(title, { lower: true, strict: true });
            const filename = `${slug}.html`;
            const filePath = path.join(OUTPUT_DIR, filename);

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

            // 4. Remove 'Direct Message' buttons and other promotional elements
            $('.directMessage').remove();
            $('.button-wrapper').remove();
            $('.subscribe-section').remove();

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

            // Calculate read time
            const textContent = $('body').text();
            const wordCount = textContent.trim().split(/\s+/).length;
            const readTime = Math.ceil(wordCount / 200) + ' min read';

            const key = title.toLowerCase().trim();
            const existing = articlesMap.get(key);

            // Save article metadata for articles.js
            const articleMeta = {
                date: date,
                title: title,
                subtitle: subtitle,
                link: `./${filename}`, // Point to local file
                originalLink: link,
                platform: 'Substack',
                readTime: readTime,
                tags: existing && existing.tags ? existing.tags : getDefaultTags(title)
            };

            articlesMap.set(key, articleMeta);

            // Generate HTML content
            const htmlContent = generateHtml(title, subtitle, date, cleanContent, link, readTime);

            // Write HTML file
            fs.writeFileSync(filePath, htmlContent);
            console.log(`Generated: ${filename}`);
        }

        // Generate articles.js
        const mergedList = Array.from(articlesMap.values());
        mergedList.sort((a, b) => new Date(b.date) - new Date(a.date));
        const articlesJsContent = `const articles = ${JSON.stringify(mergedList, null, 4)};\n`;
        fs.writeFileSync(path.join(OUTPUT_DIR, 'articles.js'), articlesJsContent);
        console.log('Updated articles.js');

    } catch (error) {
        console.error('Error fetching/parsing feed:', error);
    }
}

function generateHtml(title, subtitle, date, content, originalLink, readTime) {
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
            line-height: 1.8; /* Increased line height for better readability */
            font-size: 1.15rem;
        }
        .article-content img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 2rem 0;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1); /* Subtle shadow */
        }
        .article-content h1, .article-content h2, .article-content h3 {
            margin-top: 2.5rem;
            margin-bottom: 1.2rem;
            color: var(--highlight);
            line-height: 1.3;
        }
        .article-content a {
            color: var(--accent);
            text-decoration: none;
            border-bottom: 1px solid rgba(var(--accent-rgb), 0.3);
            transition: border-color 0.2s;
        }
        .article-content a:hover {
            border-bottom-color: var(--accent);
            color: var(--highlight);
        }
        
        /* Revised Header Styles for Aesthetics */
        .article-header {
            margin-bottom: 3.5rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid rgba(128, 128, 128, 0.2);
        }
        .article-title {
            font-size: 2.8rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: var(--fg);
            line-height: 1.2;
            letter-spacing: -0.02em;
        }
        .article-subtitle {
            font-size: 1.4rem;
            color: var(--dim);
            line-height: 1.4;
            margin-bottom: 1.5rem;
            font-weight: 400;
            opacity: 0.9;
        }
        .article-meta {
            font-family: var(--font-mono, monospace);
            font-size: 0.9rem;
            color: var(--dim);
            letter-spacing: 0.03em;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
            opacity: 0.85;
        }
        .article-meta a {
            color: var(--dim);
            text-decoration: none;
            border-bottom: 1px dotted var(--dim);
            transition: all 0.2s ease;
            margin-left: auto; /* Push link to the right on larger screens */
        }
        .article-meta a:hover {
            color: var(--highlight);
            border-bottom-color: var(--highlight);
        }
        .meta-separator {
            opacity: 0.4;
            display: inline-block;
            margin: 0 0.2rem;
        }

        .back-link {
            display: inline-block;
            margin-bottom: 3rem;
            color: var(--dim);
            text-decoration: none;
            font-family: var(--font-mono, monospace);
            font-size: 0.9rem;
            opacity: 0.7;
            transition: opacity 0.2s;
        }
        .back-link:hover {
            color: var(--highlight);
            opacity: 1;
        }
        
        .article-content pre {
            background: var(--fg); /* Inverted for code blocks */
            color: var(--bg);
            padding: 1.5rem;
            border-radius: 6px;
            overflow-x: auto;
            margin: 2rem 0;
            font-size: 0.95rem;
            line-height: 1.5;
        }
        .article-content code {
            font-family: var(--font-mono, monospace);
            font-size: 0.9em;
            background: rgba(128, 128, 128, 0.15);
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
        }
        .article-content pre code {
            background: none;
            padding: 0;
            color: inherit;
        }
        
        @media (max-width: 600px) {
            .article-title {
                font-size: 2rem;
            }
            .article-subtitle {
                font-size: 1.15rem;
            }
            .article-meta {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.5rem;
            }
            .article-meta a {
                margin-left: 0; /* Reset margin on mobile */
                margin-top: 0.5rem;
            }
             .meta-separator {
                display: none; /* Hide separator on mobile when stacked */
        }
    </style>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
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
                    ${subtitle ? `<p class="article-subtitle">${subtitle}</p>` : ''}
                    <div class="article-meta">
                        <span class="meta-item">${dateStr}</span>
                        <span class="meta-separator">/</span>
                        <span class="meta-item">${readTime}</span>
                        <a href="${originalLink}" target="_blank">Read on Substack ↗</a>
                    </div>
                </header>
                
                <div class="article-body">
                    ${content}
                </div>
            </article>
        </main>

        <hr class="blog-footer-divider">
        <div class="blog-footer-license">
            <div class="license-left">
                <p class="author-name">Sourav Tripathy</p>
                <p class="author-opinions">The opinions on this site are my own. They do not necessarily represent those of my employer.</p>
            </div>
            <div class="license-right">
                <p>This work is licensed under a <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">Creative Commons Attribution 4.0 International License</a>.</p>
            </div>
        </div>

        <footer>
            <div class="social-links" style="margin-bottom: 2rem;">
              <a href="mailto:lipuntripathy74@gmail.com" target="_blank">Email</a>
                <a href="https://x.com/EssenceThinker" target="_blank">X (Twitter)</a>
                <a href="https://www.linkedin.com/in/sourav-tripathy-astrophile/" target="_blank">LinkedIn</a>
                <a href="https://github.com/Sourav-Tripathy" target="_blank">GitHub</a>
                <a href="https://siliconandsoul.substack.com" target="_blank">Substack</a>
                <a href="https://letterboxd.com/essenceX/" target="_blank">Letterboxd</a>
                <a href="https://www.goodreads.com/user/show/82254166-sourav-tripathy" target="_blank">Goodreads</a>
            </div>
            © <span id="year"></span> Sourav Tripathy
        </footer>
    </div>
    <script src="../script.js"></script>
    <script>
        document.getElementById("year").textContent = new Date().getFullYear();
        
        // Render Substack LaTeX formulas
        document.addEventListener("DOMContentLoaded", function() {
            document.querySelectorAll('.latex-rendered').forEach(function(el) {
                try {
                    const rawAttrs = el.getAttribute('data-attrs');
                    if (rawAttrs) {
                        const attrs = JSON.parse(rawAttrs);
                        const formula = attrs.persistentExpression;
                        if (formula) {
                            const isBlock = el.getAttribute('data-component-name') === 'LatexBlockToDOM';
                            katex.render(formula, el, {
                                displayMode: isBlock,
                                throwOnError: false
                            });
                        }
                    }
                } catch (e) {
                    console.error("Failed to render LaTeX:", e);
                }
            });
        });
    </script>
</body>
</html>`;
}

main();
