---
description: Update blog posts from RSS feed
---

This workflow fetches the latest blog posts from your Substack RSS feed and generates static HTML files for them in the `public/blog/` directory.

1. Install dependencies (if not already done):
```bash
npm install
```

2. Run the fetch script:
// turbo
```bash
node scripts/fetch-articles.js
```

This will:
- Fetch the RSS feed from `https://siliconandsoul.substack.com/feed`
- Generate HTML files for each article (e.g., `public/blog/article-slug.html`)
- Update `public/blog/articles.js` with the new article metadata and local links.
