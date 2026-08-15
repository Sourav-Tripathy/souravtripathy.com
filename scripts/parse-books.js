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

    // Sort books: 
    // - read books: sort by readDate DESC (most recently read first)
    // - currently-reading books: sort by addedDate DESC
    // - to-read books: sort by addedDate DESC
    books.sort((a, b) => {
        if (a.shelf === 'read' && b.shelf === 'read') {
            const dateA = a.readDate ? new Date(a.readDate) : new Date(0);
            const dateB = b.readDate ? new Date(b.readDate) : new Date(0);
            return dateB - dateA;
        }
        const dateA = a.addedDate ? new Date(a.addedDate) : new Date(0);
        const dateB = b.addedDate ? new Date(b.addedDate) : new Date(0);
        return dateB - dateA;
    });

    fs.writeFileSync(outputPath, JSON.stringify(books, null, 2));
    console.log(`Successfully processed ${books.length} books.`);
    console.log(`Saved JSON data to: ${outputPath}`);
}

processBooks();
