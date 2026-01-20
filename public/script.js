// 1. Navigation Logic
// Since we are using multi-page, we just ensure the current page's link is active
// This is handled via HTML classes, but we could enforce it here if needed.
// For now, no client-side routing logic is required.

// 2. Blog Rendering
function renderArticles() {
    // Only run if the articles-list element exists
    const list = document.getElementById('articles-list');
    if (!list) return;

    // Sort Descending
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));

    let currentYear = null;
    // Stagger delay counter
    let delay = 0;

    articles.forEach(art => {
        const artYear = art.date.split('-')[0];
        if (artYear !== currentYear) {
            currentYear = artYear;
            const yearHeader = document.createElement('div');
            yearHeader.className = 'year-separator fade-in-item';
            yearHeader.style.animationDelay = `${delay}ms`;
            yearHeader.innerText = currentYear;
            list.appendChild(yearHeader);
            delay += 50;
        }

        const item = document.createElement('div');
        item.className = 'article-item fade-in-item';
        item.style.animationDelay = `${delay}ms`;
        delay += 50; // Increment delay for next item

        // Date formatting: "Jan 12"
        const dateObj = new Date(art.date);
        const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        item.innerHTML = `
             <a href="${art.link}" target="_blank" class="article-title">${art.title}</a>
             <span class="article-meta">${dateStr}</span>
        `;
        list.appendChild(item);
    });
}
// 3. Mars Time
function updateMarsTime() {
    const d = (new Date() - new Date('2000-01-06T00:00:00Z')) / 86400000;
    const msd = (d - 4.5) / 1.027491252 + 44796.0;
    const mtc = (msd * 24) % 24;

    const h = Math.floor(mtc);
    const m = Math.floor((mtc - h) * 60);
    const s = Math.floor(((mtc - h) * 60 - m) * 60);

    const el = document.getElementById('mars-time');
    if (el) el.innerText = `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} MTC`;

    // Daylight logic (Roughly 06:00 to 18:00 is day)
    const dayEl = document.getElementById('mars-daylight');
    if (dayEl) {
        if (mtc > 6 && mtc < 18) {
            dayEl.innerText = "It is currently daytime on Mars.";
        } else {
            dayEl.innerText = "It is currently night on Mars.";
        }
    }
}

// 4. IP Number Theory 
async function initIpMagic() {
    const ipEl = document.getElementById('ip-address');
    const theoryEl = document.getElementById('ip-info');
    if (!ipEl) return;

    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        const ip = data.ip;
        ipEl.innerText = ip;

        // Perform 
        // 1. Sum of octets (IPv4)
        if (ip.includes('.')) {
            const parts = ip.split('.').map(Number);
            const sum = parts.reduce((a, b) => a + b, 0);

            let magicText = `The sum of your octets is ${sum}.`;

            if (isPrime(sum)) {
                magicText += " That is a prime number.";
            } else if (sum % 2 === 0) {
                magicText += ` It's an even number (2 × ${sum / 2}).`;
            } else {
                magicText += " An odd number.";
            }

            // Binary rep of first octet
            magicText += ` Your first byte in binary is ${parts[0].toString(2)}.`;

            theoryEl.innerText = magicText;
        } else {
            theoryEl.innerText = "IPv6? You are living in the future.";
        }

    } catch {
        ipEl.innerText = "Hidden by the void";
    }
}

function isPrime(num) {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

// 5. Coffee Steam Animation
function startCoffeeAnimation() {
    const el = document.getElementById('ascii-mug');
    if (!el) return;

    const mugBase =
        `      .------.    
      |      |]   
      |      |    
      '------'    `;

    // Steam frames (Brackets & Dashes)
    const frames = [
        `      (   -   )
        )   (
`,
        `      -   )   -
        (   -
`,
        `      )   -   (
        -   )
`
    ];

    let i = 0;
    setInterval(() => {
        el.innerText = frames[i] + mugBase;
        i = (i + 1) % frames.length;
    }, 600);
}


// 6. ISS Tracker
let currentIssPos = { lat: 0, lon: 0 };
let currentUserPos = null;

async function initISSTracker() {
    const distEl = document.getElementById('iss-distance');
    const detailEl = document.getElementById('iss-detail');
    if (!distEl) return;

    // --- Configuration ---
    const RATE_LIMIT_WINDOW = 2000; // Minimum time between API calls in ms (conservatively 2s)
    const POLL_INTERVAL = 5000;     // Auto-refresh every 5 seconds
    const IP_CACHE_KEY = 'user_geo_cache_v1';
    const ISS_CACHE_KEY = 'iss_pos_cache_v1';

    // --- State ---
    let isRequestPending = false;

    // --- Helpers ---
    function getCached(key, ttlMs) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return null;
            const data = JSON.parse(raw);
            if (Date.now() - data.timestamp < ttlMs) {
                return data.payload;
            }
        } catch (e) { console.error("Cache read error", e); }
        return null;
    }

    function setCached(key, payload) {
        try {
            localStorage.setItem(key, JSON.stringify({
                timestamp: Date.now(),
                payload: payload
            }));
        } catch (e) { console.error("Cache write error", e); }
    }

    // --- Logic ---

    // 1. Get User Location (Aggressively cached)
    const cachedUserLoc = getCached(IP_CACHE_KEY, 3600 * 1000);
    if (cachedUserLoc) {
        currentUserPos = cachedUserLoc;
    } else {
        try {
            // Primary: ipwho.is (HTTPS, No Key)
            const ipRes = await fetch('https://ipwho.is/');
            if (ipRes.ok) {
                const ipData = await ipRes.json();
                if (ipData.success) {
                    currentUserPos = { lat: ipData.latitude, lon: ipData.longitude };
                    setCached(IP_CACHE_KEY, currentUserPos);
                } else {
                    console.warn("ipwho.is failed (success:false):", ipData.message);
                    throw new Error("ipwho.is failed");
                }
            } else {
                throw new Error("ipwho.is returned " + ipRes.status);
            }
        } catch (e) {
            console.warn("Primary geo-limit reached or blocked. Trying fallback...", e);
            try {
                // Secondary: ipapi.co (HTTPS, Rate Limit: 1000/day)
                const res2 = await fetch('https://ipapi.co/json/');
                if (res2.ok) {
                    const data2 = await res2.json();
                    if (data2.latitude && data2.longitude) {
                        currentUserPos = { lat: data2.latitude, lon: data2.longitude };
                        setCached(IP_CACHE_KEY, currentUserPos);
                    }
                }
            } catch (e2) {
                console.warn("All IP geolocations failed. Trying browser API...", e2);
                // Final Fallback: Browser Geolocation (Permission Required)
                if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(
                        (pos) => {
                            currentUserPos = { lat: pos.coords.latitude, lon: pos.coords.longitude };
                            setCached(IP_CACHE_KEY, currentUserPos);
                        },
                        (err) => {
                            console.warn("Browser geolocation denied/failed:", err);
                        }
                    );
                }
            }
        }
    }

    // 2. ISS Fetch & Update Function
    async function updateISS() {
        if (isRequestPending) return;

        const cachedIss = getCached(ISS_CACHE_KEY, RATE_LIMIT_WINDOW);
        if (cachedIss) {
            currentIssPos = cachedIss;
            renderISS(cachedIss.lat, cachedIss.lon, false);

            if (window.updateGlobeData) {
                window.updateGlobeData(currentIssPos, currentUserPos);
            }
            return;
        }

        isRequestPending = true;
        try {
            const issRes = await fetch('https://api.wheretheiss.at/v1/satellites/25544');

            if (issRes.status === 429) throw new Error("Rate limit exceeded");

            const remaining = issRes.headers.get('X-Rl');
            if (remaining && parseInt(remaining) === 0) console.warn("ISS API Throttled");

            if (!issRes.ok) throw new Error("ISS API failed");

            const issData = await issRes.json();
            const issLat = issData.latitude;
            const issLon = issData.longitude;

            // Save to cache
            currentIssPos = { lat: issLat, lon: issLon };
            setCached(ISS_CACHE_KEY, currentIssPos);

            renderISS(issLat, issLon, true);

            // Update 3D Globe
            if (window.updateGlobeData) {
                window.updateGlobeData(currentIssPos, currentUserPos);
            }

        } catch (e) {
            console.error("ISS Update Error:", e);
            const staleIss = getCached(ISS_CACHE_KEY, 60000);
            if (staleIss) {
                currentIssPos = staleIss;
                distEl.innerText = "Connection Weak...";
                renderISS(staleIss.lat, staleIss.lon, false);
            } else {
                distEl.innerText = "Signal Lost";
                detailEl.innerText = "Unable to contact station.";
            }
        } finally {
            isRequestPending = false;
        }
    }

    // 3. Render Function
    function renderISS(issLat, issLon, isLive) {
        const coordText = `ISS at Lat: ${issLat.toFixed(2)}, Lon: ${issLon.toFixed(2)}`;

        if (currentUserPos) {
            const R = 6371; // km
            const dLat = (issLat - currentUserPos.lat) * Math.PI / 180;
            const dLon = (issLon - currentUserPos.lon) * Math.PI / 180;
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(currentUserPos.lat * Math.PI / 180) * Math.cos(issLat * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const d = R * c;

            distEl.innerText = `${Math.round(d).toLocaleString()} km away`;
            detailEl.innerText = coordText;
        } else {
            distEl.innerText = `Lat: ${issLat.toFixed(2)}, Lon: ${issLon.toFixed(2)}`;
            detailEl.innerText = "Distance unavailable (User location unknown).";
        }
    }

    // Initial call
    updateISS();
    setInterval(updateISS, POLL_INTERVAL);
}

// 7. Render Now Page
function renderNowPage() {
    const container = document.getElementById('now-container');
    const data = window.nowData;

    if (!container || !data) return;

    // Clear container
    container.innerHTML = '';

    let delay = 0;

    // Render Reading Section
    if (data.reading && data.reading.length > 0) {
        const block = document.createElement('div');
        block.className = 'info-block fade-in-item';
        block.style.borderLeftColor = 'var(--highlight)'; // Greenish for reading
        block.style.animationDelay = `${delay}ms`;
        delay += 100;

        const label = document.createElement('span');
        label.className = 'label';
        label.innerText = 'Reading';
        block.appendChild(label);

        data.reading.forEach(book => {
            const value = document.createElement('div');
            value.className = 'value';
            value.style.fontSize = '1.1rem';
            value.style.marginBottom = '0.5rem';
            value.style.fontWeight = 'normal';

            value.innerHTML = `
                <a href="${book.titleLink}" target="_blank" class="article-title" style="font-style: italic;">${book.title}</a>
                <span style="font-size: 0.9em; opacity: 0.8;"> by <a href="${book.authorLink}" target="_blank" class="article-title">${book.author}</a></span>
            `;
            block.appendChild(value);
        });
        container.appendChild(block);
    }

    // Render Listening Section
    if (data.listening && data.listening.length > 0) {
        const block = document.createElement('div');
        block.className = 'info-block fade-in-item';
        block.style.borderLeftColor = 'var(--accent)'; // Brownish for assignments/music
        block.style.animationDelay = `${delay}ms`;
        delay += 100;

        const label = document.createElement('span');
        label.className = 'label';
        label.innerText = 'Listening To';
        block.appendChild(label);

        data.listening.forEach(song => {
            const value = document.createElement('div');
            value.className = 'value';
            value.style.fontSize = '1.1rem';
            value.style.marginBottom = '0.5rem';
            value.style.fontWeight = 'normal';

            value.innerHTML = `
                <a href="${song.link}" target="_blank" class="article-title">${song.title}</a>
            `;
            block.appendChild(value);
        });
        container.appendChild(block);
    }
}


// Init
document.addEventListener('DOMContentLoaded', () => {
    // initTabs(); // Logic moved to MPA structure
    renderArticles();
    renderNowPage();
    startCoffeeAnimation();
    initIpMagic();
    initISSTracker();
    // Globe initialized within ISSTracker or separate interaction

    // Update Mars time every second
    setInterval(updateMarsTime, 1000);
    updateMarsTime();

    document.getElementById("year").textContent = new Date().getFullYear();
});
