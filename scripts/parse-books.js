const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../goodreads_library_export.csv');
const outputPath = path.join(__dirname, '../public/curations/shelf/books-data.json');

function parseCSV(csvText) {
    const lines = [];
    let currentLine = [];
    let currentWord = '';
    let inQuotes = false;
    
    for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];
        const nextChar = csvText[i + 1];
        
        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                // Escaped quote
                currentWord += '"';
                i++; // Skip next quote
            } else {
                // Toggle quote state
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            currentLine.push(currentWord);
            currentWord = '';
        } else if ((char === '\r' || char === '\n') && !inQuotes) {
            if (char === '\r' && nextChar === '\n') {
                i++; // Skip \n
            }
            currentLine.push(currentWord);
            lines.push(currentLine);
            currentLine = [];
            currentWord = '';
        } else {
            currentWord += char;
        }
    }
    if (currentWord || currentLine.length > 0) {
        currentLine.push(currentWord);
        lines.push(currentLine);
    }
    return lines;
}

function processBooks() {
    if (!fs.existsSync(csvPath)) {
        console.error(`CSV file not found at: ${csvPath}`);
        return;
    }

    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const parsedLines = parseCSV(csvContent);

    if (parsedLines.length < 2) {
        console.error('CSV file has no data lines.');
        return;
    }

    const header = parsedLines[0];
    const dataLines = parsedLines.slice(1);

    // Map column names to index
    const colMap = {};
    header.forEach((colName, idx) => {
        colMap[colName.trim()] = idx;
    });

    const getVal = (row, colName) => {
        const idx = colMap[colName];
        if (idx === undefined) return '';
        return row[idx] ? row[idx].trim() : '';
    };

    const books = [];

    dataLines.forEach(row => {
        if (row.length < header.length) {
            // Skip empty or corrupted lines
            return;
        }

        const id = getVal(row, 'Book Id');
        if (!id) return; // Skip if no book ID

        let title = getVal(row, 'Title');
        // Clean title if it contains things like "Foundation (Foundation, #1)"
        // Keep it as is or do minor cleanup, but Goodreads titles are generally good
        
        const author = getVal(row, 'Author');
        
        const ratingVal = getVal(row, 'My Rating');
        const rating = ratingVal ? parseFloat(ratingVal) : 0;
        
        const publisher = getVal(row, 'Publisher');
        
        const numPagesVal = getVal(row, 'Number of Pages');
        const numPages = numPagesVal ? parseInt(numPagesVal, 10) : null;
        
        const yearPubVal = getVal(row, 'Year Published');
        const origYearPubVal = getVal(row, 'Original Publication Year');
        let year = origYearPubVal ? parseInt(origYearPubVal, 10) : (yearPubVal ? parseInt(yearPubVal, 10) : null);

        const readDate = getVal(row, 'Date Read') || null;
        const addedDate = getVal(row, 'Date Added') || null;
        const shelf = getVal(row, 'Exclusive Shelf') || 'to-read';
        
        let review = getVal(row, 'My Review') || null;
        // Clean up empty Goodreads reviews or default strings
        if (review === '""' || review === '') {
            review = null;
        }

        books.push({
            id,
            title,
            author,
            rating,
            publisher,
            numPages,
            year,
            readDate,
            addedDate,
            shelf,
            review
        });
    });

    // Load existing books if file exists to preserve custom edits & reviews
    let existingBooks = [];
    if (fs.existsSync(outputPath)) {
        try {
            existingBooks = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
        } catch (e) {
            console.error('Could not parse existing books-data.json:', e.message);
        }
    }

    const csvBooksMap = new Map();
    books.forEach(b => csvBooksMap.set(b.id, b));

    const existingIds = new Set(existingBooks.map(b => b.id));

    // Update existing books with CSV changes (shelf status, read date, rating, review if new)
    existingBooks.forEach(b => {
        const csvB = csvBooksMap.get(b.id);
        if (csvB) {
            if (csvB.shelf) b.shelf = csvB.shelf;
            if (csvB.readDate) b.readDate = csvB.readDate;
            if (csvB.rating > 0) b.rating = csvB.rating;
            if (!b.review && csvB.review) b.review = csvB.review;
        }
    });

    // Extract new books
    const newBooks = books.filter(b => !existingIds.has(b.id));

    const finalBooks = [...newBooks, ...existingBooks];

    fs.writeFileSync(outputPath, JSON.stringify(finalBooks, null, 2));
    console.log(`Successfully merged books. Added ${newBooks.length} new books. Total: ${finalBooks.length}`);
    console.log(`Saved JSON data to: ${outputPath}`);
}

processBooks();
