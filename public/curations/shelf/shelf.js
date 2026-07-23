let rawShelfData = [];
let activeTab = 'articles'; // 'articles' or 'books'
let activeView = 'list'; // 'list' or 'graph'
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
    initShelf();
});

async function initShelf() {
    const contentArea = document.getElementById('shelf-content-area');
    contentArea.innerHTML = '<div class="empty-state"><div class="empty-state-title">Loading Reading Shelf...</div><div class="empty-state-desc">Fetching articles from the archive.</div></div>';

    try {
        const response = await fetch('shelf-data.json');
        if (!response.ok) {
            throw new Error('Failed to load shelf data');
        }
        rawShelfData = await response.json();
        
        // Setup Event Listeners
        setupEventListeners();
        
        // Initial Render
        renderShelf();
    } catch (error) {
        console.error('Error loading shelf data:', error);
        contentArea.innerHTML = `
            <div class="empty-state" style="border-color: #ff6b6b;">
                <div class="empty-state-title" style="color: #ff6b6b;">Failed to Load Shelf</div>
                <div class="empty-state-desc">Could not load the reading shelf data. Please check back later.</div>
            </div>
        `;
    }
}

function setupEventListeners() {
    // Tabs
    const tabArticles = document.getElementById('tab-articles');
    const tabBooks = document.getElementById('tab-books');
    
    tabArticles.addEventListener('click', () => {
        if (activeTab === 'articles') return;
        activeTab = 'articles';
        tabArticles.classList.add('active');
        tabBooks.classList.remove('active');
        
        // Show controls row
        document.getElementById('controls-row').style.display = 'flex';
        
        renderShelf();
    });
    
    tabBooks.addEventListener('click', () => {
        if (activeTab === 'books') return;
        activeTab = 'books';
        tabBooks.classList.add('active');
        tabArticles.classList.remove('active');
        
        // Hide controls row for books since it is currently empty
        document.getElementById('controls-row').style.display = 'none';
        
        renderShelf();
    });

    // Search Input
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderShelf();
    });

    // View Toggles
    const viewList = document.getElementById('view-list');
    const viewGraph = document.getElementById('view-graph');

    viewList.addEventListener('click', () => {
        if (activeView === 'list') return;
        activeView = 'list';
        viewList.classList.add('active');
        viewGraph.classList.remove('active');
        renderShelf();
    });

    viewGraph.addEventListener('click', () => {
        if (activeView === 'graph') return;
        activeView = 'graph';
        viewGraph.classList.add('active');
        viewList.classList.remove('active');
        renderShelf();
    });
}

function showGraphComingSoonMessage() {
    const contentArea = document.getElementById('shelf-content-area');
    contentArea.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-desc" style="margin-bottom: 1.5rem;">This will be updated soon.</div>
            <button class="view-btn active" onclick="goBackToList()">return to list view</button>
        </div>
    `;
}

window.goBackToList = function() {
    activeView = 'list';
    document.getElementById('view-list').classList.add('active');
    document.getElementById('view-graph').classList.remove('active');
    renderShelf();
};

function renderShelf() {
    const contentArea = document.getElementById('shelf-content-area');
    contentArea.innerHTML = '';

    if (activeTab === 'books') {
        renderBooksEmptyState();
        return;
    }

    if (activeView === 'graph') {
        showGraphComingSoonMessage();
        return;
    }

    // Process and filter articles
    let filteredData = [];
    let totalArticles = 0;

    // Filter links inside each day entry
    rawShelfData.forEach(dayEntry => {
        const matchingLinks = dayEntry.links.filter(link => {
            const titleMatch = link.title.toLowerCase().includes(searchQuery);
            const urlMatch = link.url.toLowerCase().includes(searchQuery);
            const noteMatch = link.note && link.note.toLowerCase().includes(searchQuery);
            return titleMatch || urlMatch || noteMatch;
        });

        if (matchingLinks.length > 0) {
            filteredData.push({
                ...dayEntry,
                links: matchingLinks
            });
            totalArticles += matchingLinks.length;
        }
    });

    if (totalArticles === 0) {
        contentArea.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-title">No matches found</div>
                <div class="empty-state-desc">Try search terms like "finshots", "ai", "physics", or "system".</div>
            </div>
        `;
        return;
    }

    // Render Stats
    const statsDiv = document.createElement('div');
    statsDiv.className = 'stats-container';
    statsDiv.style.marginBottom = '2rem';
    statsDiv.innerHTML = `
        <span>showing <span class="stat-badge">${totalArticles}</span> articles / blogs read across <span class="stat-badge">${filteredData.length}</span> active days</span>
    `;
    contentArea.appendChild(statsDiv);

    // Grouping by Year and Month in descending order (reverse chronological)
    // We reverse the filtered data to start with the newest entries (2026)
    const reversedData = [...filteredData].reverse();

    const dataByYear = {};

    reversedData.forEach(dayEntry => {
        const year = dayEntry.year;
        if (!dataByYear[year]) {
            dataByYear[year] = [];
        }
        dataByYear[year].push(dayEntry);
    });

    // Render each Year block
    const years = Object.keys(dataByYear).sort((a, b) => b - a);

    years.forEach(year => {
        const yearSection = document.createElement('section');
        yearSection.className = 'timeline-year';
        
        const yearHeader = document.createElement('h2');
        yearHeader.className = 'year-title';
        yearHeader.innerText = year;
        yearSection.appendChild(yearHeader);

        // Group by Month within this year
        // We want to preserve the order in reversedData
        const monthsInYear = [];
        const dataByMonth = {};

        dataByYear[year].forEach(dayEntry => {
            // Extracts month name from date string (e.g. "26th December" -> "December")
            const parts = dayEntry.date.split(' ');
            const month = parts[parts.length - 1]; // Last word is month name

            if (!dataByMonth[month]) {
                dataByMonth[month] = [];
                monthsInYear.push(month); // Order of encounter is already descending
            }
            dataByMonth[month].push(dayEntry);
        });

        monthsInYear.forEach(month => {
            const monthDiv = document.createElement('div');
            monthDiv.className = 'timeline-month';

            const monthHeader = document.createElement('h3');
            monthHeader.className = 'month-title';
            monthHeader.innerText = month;
            monthDiv.appendChild(monthHeader);

            const ul = document.createElement('ul');
            ul.className = 'shelf-list';

            dataByMonth[month].forEach(dayEntry => {
                dayEntry.links.forEach(link => {
                    const li = document.createElement('li');
                    li.className = 'shelf-item';

                    // Get the day part of date (e.g. "26th December" -> "26th")
                    const dayPart = dayEntry.date.split(' ')[0];

                    // Determine note badge class
                    let noteBadge = '';
                    if (link.note) {
                        const isExceptional = link.note.toLowerCase().includes('exceptional') || link.note.toLowerCase().includes('must read');
                        const badgeClass = isExceptional ? 'item-note-badge exceptional' : 'item-note-badge';
                        noteBadge = `<span class="${badgeClass}">${link.note}</span>`;
                    }

                    li.innerHTML = `
                        <div class="item-date">${dayPart}</div>
                        <div class="item-content">
                            <a href="${link.url}" target="_blank" class="item-link">${link.title}</a>
                            ${noteBadge}
                        </div>
                    `;
                    ul.appendChild(li);
                });
            });

            monthDiv.appendChild(ul);
            yearSection.appendChild(monthDiv);
        });

        contentArea.appendChild(yearSection);
    });
}

function renderBooksEmptyState() {
    const contentArea = document.getElementById('shelf-content-area');
    contentArea.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-desc">This will be updated shortly.</div>
        </div>
    `;
}
