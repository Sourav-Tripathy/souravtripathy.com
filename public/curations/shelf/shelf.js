let rawShelfData = [];
let rawBooksData = [];
let activeTab = 'articles'; // 'articles' or 'books'
let activeBookShelf = 'read'; // 'read', 'to-read'
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
    const bookFilters = document.getElementById('book-filters');
    const searchInput = document.getElementById('search-input');
    
    tabArticles.addEventListener('click', () => {
        if (activeTab === 'articles') return;
        activeTab = 'articles';
        tabArticles.classList.add('active');
        tabBooks.classList.remove('active');
        
        // UI Layout updates
        bookFilters.style.display = 'none';
        searchInput.placeholder = 'Search by title, domain, or notes...';
        
        renderShelf();
    });
    
    tabBooks.addEventListener('click', async () => {
        if (activeTab === 'books') return;
        activeTab = 'books';
        tabBooks.classList.add('active');
        tabArticles.classList.remove('active');
        
        // UI Layout updates
        bookFilters.style.display = 'flex';
        searchInput.placeholder = 'Search by title, author, or reviews...';
        
        // Load books data if not already done
        if (rawBooksData.length === 0) {
            const contentArea = document.getElementById('shelf-content-area');
            contentArea.innerHTML = '<div class="empty-state"><div class="empty-state-title">Loading Books...</div><div class="empty-state-desc">Parsing Goodreads library export.</div></div>';
            await loadBooksData();
        }
        
        renderShelf();
    });

    // Book shelf filters
    const filterBtns = bookFilters.querySelectorAll('.view-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeBookShelf = btn.dataset.shelf;
            renderShelf();
        });
    });

    // Search Input
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderShelf();
    });
}

async function loadBooksData() {
    try {
        const response = await fetch('books-data.json');
        if (!response.ok) {
            throw new Error('Failed to load books data');
        }
        rawBooksData = await response.json();
    } catch (error) {
        console.error('Error loading books data:', error);
        const contentArea = document.getElementById('shelf-content-area');
        contentArea.innerHTML = `
            <div class="empty-state" style="border-color: #ff6b6b;">
                <div class="empty-state-title" style="color: #ff6b6b;">Failed to Load Books</div>
                <div class="empty-state-desc">Could not load the books data. Please try again later.</div>
            </div>
        `;
    }
}

window.toggleReview = function(bookId) {
    const content = document.getElementById(`review-${bookId}`);
    const toggle = document.getElementById(`toggle-${bookId}`);
    if (!content || !toggle) return;
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        toggle.innerText = '[-] hide review';
    } else {
        content.style.display = 'none';
        toggle.innerText = '[+] read review';
    }
};

function parseBookDate(dateStr) {
    if (!dateStr) return { year: 'Unknown', month: 'Unknown', day: '' };
    const parts = dateStr.split('/');
    if (parts.length < 3) return { year: 'Unknown', month: 'Unknown', day: '' };
    
    const year = parts[0];
    const monthIdx = parseInt(parts[1], 10) - 1;
    const dayNum = parseInt(parts[2], 10);
    
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = monthNames[monthIdx] || 'Unknown';
    
    const getOrdinalNum = (n) => {
        return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
    };
    const day = getOrdinalNum(dayNum);
    
    return { year, month, day };
}

function renderShelf() {
    if (activeTab === 'books') {
        renderBooks();
    } else {
        renderShelfArticles();
    }
}

function renderShelfArticles() {
    const contentArea = document.getElementById('shelf-content-area');
    contentArea.innerHTML = '';

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
        const monthsInYear = [];
        const dataByMonth = {};

        dataByYear[year].forEach(dayEntry => {
            const parts = dayEntry.date.split(' ');
            const month = parts[parts.length - 1]; // Last word is month name

            if (!dataByMonth[month]) {
                dataByMonth[month] = [];
                monthsInYear.push(month);
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

                    const dayPart = dayEntry.date.split(' ')[0];

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

function renderBooks() {
    const contentArea = document.getElementById('shelf-content-area');
    contentArea.innerHTML = '';

    // Filter books based on shelf and search query
    const filteredBooks = rawBooksData.filter(book => {
        if (book.shelf !== activeBookShelf) return false;
        
        if (!searchQuery) return true;
        
        const titleMatch = book.title && book.title.toLowerCase().includes(searchQuery);
        const authorMatch = book.author && book.author.toLowerCase().includes(searchQuery);
        const reviewMatch = book.review && book.review.toLowerCase().includes(searchQuery);
        const tagMatch = book.tags && book.tags.some(t => t.toLowerCase().includes(searchQuery));
        
        return titleMatch || authorMatch || reviewMatch || tagMatch;
    });

    if (filteredBooks.length === 0) {
        contentArea.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-title">No matching books found</div>
                <div class="empty-state-desc">Try search terms like book titles, authors, or review words.</div>
            </div>
        `;
        return;
    }

    // Render Stats
    const statsDiv = document.createElement('div');
    statsDiv.className = 'stats-container';
    statsDiv.style.marginBottom = '2rem';
    
    let statsText = '';
    if (activeBookShelf === 'read') {
        const yearsCount = new Set(filteredBooks.map(b => parseBookDate(b.readDate).year)).size;
        statsText = `showing <span class="stat-badge">${filteredBooks.length}</span> books completed across <span class="stat-badge">${yearsCount}</span> active years`;
    } else {
        statsText = `showing <span class="stat-badge">${filteredBooks.length}</span> books in to be read (TBR)`;
    }
    
    statsDiv.innerHTML = `<span>${statsText}</span>`;
    contentArea.appendChild(statsDiv);

    // Grouping
    const groupedData = {};
    const yearOrder = [];
    
    filteredBooks.forEach(book => {
        const dateToUse = activeBookShelf === 'read' ? book.readDate : book.addedDate;
        const { year, month, day } = parseBookDate(dateToUse);
        
        if (!groupedData[year]) {
            groupedData[year] = {
                months: {},
                monthOrder: []
            };
            yearOrder.push(year);
        }
        
        if (!groupedData[year].months[month]) {
            groupedData[year].months[month] = [];
            groupedData[year].monthOrder.push(month);
        }
        
        groupedData[year].months[month].push({
            ...book,
            day
        });
    });

    // Sort yearOrder in descending order (newest years first)
    yearOrder.sort((a, b) => {
        if (a === 'Unknown' || a === 'unknown') return 1;
        if (b === 'Unknown' || b === 'unknown') return -1;
        return b - a;
    });

    yearOrder.forEach(year => {
        const yearSection = document.createElement('section');
        yearSection.className = 'timeline-year';
        
        const yearHeader = document.createElement('h2');
        yearHeader.className = 'year-title';
        yearHeader.innerText = year;
        yearSection.appendChild(yearHeader);

        const { months, monthOrder } = groupedData[year];
        
        // Month ordering: order by chronological month index
        const monthNames = [
            'December', 'November', 'October', 'September', 'August', 'July',
            'June', 'May', 'April', 'March', 'February', 'January', 'Unknown'
        ];
        
        monthOrder.sort((a, b) => {
            return monthNames.indexOf(a) - monthNames.indexOf(b);
        });
        
        monthOrder.forEach(month => {
            const monthDiv = document.createElement('div');
            monthDiv.className = 'timeline-month';

            const monthHeader = document.createElement('h3');
            monthHeader.className = 'month-title';
            monthHeader.innerText = month;
            monthDiv.appendChild(monthHeader);

            const bookListDiv = document.createElement('div');
            bookListDiv.className = 'book-list';

            months[month].forEach(book => {
                const card = document.createElement('div');
                card.className = 'book-card';
                
                // Stars HTML
                let starsHtml = '';
                if (book.rating > 0) {
                    starsHtml = `<span class="book-rating">${'★'.repeat(book.rating)}${'☆'.repeat(5 - book.rating)}</span>`;
                }

                // Date label
                const dateLabel = activeBookShelf === 'read' ? `completed on ${book.day}` : `added ${book.day}`;

                // Review HTML
                let reviewHtml = '';
                if (book.review) {
                    reviewHtml = `
                        <div class="book-review-toggle" id="toggle-${book.id}" onclick="window.toggleReview('${book.id}')">
                            [+] read review
                        </div>
                        <div class="book-review-content" id="review-${book.id}" style="display: none;">
                            ${book.review}
                        </div>
                    `;
                }

                card.innerHTML = `
                    <div class="book-card-header">
                        <div class="book-info">
                            <div class="book-title-container">
                                <a href="https://www.goodreads.com/book/show/${book.id}" target="_blank" class="book-title-link">${book.title}</a>
                                ${book.year ? `<span class="book-year">(${book.year})</span>` : ''}
                            </div>
                            <div class="book-author">by ${book.author}</div>
                        </div>
                        <div class="book-meta">
                            ${starsHtml}
                            <div class="book-date">${dateLabel}</div>
                        </div>
                    </div>
                    ${reviewHtml}
                `;
                
                bookListDiv.appendChild(card);
            });

            monthDiv.appendChild(bookListDiv);
            yearSection.appendChild(monthDiv);
        });

        contentArea.appendChild(yearSection);
    });
}
