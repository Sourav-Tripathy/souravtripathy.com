// 1. Tab Logic
function initTabs() {
    const buttons = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Deactivate all
            buttons.forEach(b => b.classList.remove('active'));
            contents.forEach(c => c.classList.add('hidden'));
            contents.forEach(c => c.classList.remove('active'));

            // Activate target
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);

            // Check if content exists before removing hidden class
            if (targetContent) {
                targetContent.classList.remove('hidden');
                targetContent.classList.add('active');
            }
        });
    });
}

// 2. Blog Rendering
function renderArticles() {
    const list = document.getElementById('articles-list');
    if (!list) return;

    // Sort Descending
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));

    let currentYear = null;

    articles.forEach(art => {
        const artYear = art.date.split('-')[0];
        if (artYear !== currentYear) {
            currentYear = artYear;
            const yearHeader = document.createElement('div');
            yearHeader.className = 'year-separator';
            yearHeader.innerText = currentYear;
            list.appendChild(yearHeader);
        }

        const item = document.createElement('div');
        item.className = 'article-item';
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

// 4. IP Number Theory Magic
async function initIpMagic() {
    const ipEl = document.getElementById('ip-address');
    const theoryEl = document.getElementById('ip-info');
    if (!ipEl) return;

    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        const ip = data.ip;
        ipEl.innerText = ip;

        // Perform magic
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


// Init
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    renderArticles();
    startCoffeeAnimation();
    initIpMagic();

    // Update Mars time every second
    setInterval(updateMarsTime, 1000);
    updateMarsTime();

    document.getElementById("year").textContent = new Date().getFullYear();
});
