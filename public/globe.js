
// Minimalist Circular Orbit Tracker (2D Canvas)
// "Imaginary Earth" - Just the path, the ISS, and You.

const THEME = {
    orbit: '#4a6c56',   // --dim (The path)
    orbitBg: 'rgba(74, 108, 86, 0.1)', // Faint trail
    iss: '#a37f5f',     // --accent (ISS)
    user: '#2d6a45',    // --highlight (User)
    text: '#4a6c56'
};

let ctx;
let width, height;
let centerX, centerY;
let radius;
let isRunning = false;

// State
let currentIss = { lat: 0, lon: 0 };
let currentUser = null;

// Animation State
let renderRotation = 0; // Visual slow rotation of the "grid"

function initModernGlobe(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Create Canvas
    container.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    ctx = canvas.getContext('2d');

    // Use ResizeObserver to handle size changes (especially when tab becomes visible)
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            const { width: newWidth, height: newHeight } = entry.contentRect;

            if (newWidth === 0 || newHeight === 0) return;

            width = newWidth;
            height = newHeight;

            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);

            centerX = width / 2;
            centerY = height / 2;
            radius = Math.min(width, height) * 0.35;
        }
    });

    resizeObserver.observe(container);

    if (!isRunning) {
        isRunning = true;
        animate();
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);

    // 1. Draw "Imaginary Earth" (The Orbit Path)
    // Dashed Ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = THEME.orbitBg;
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = THEME.orbit;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 8]); // Dashed effect
    ctx.lineDashOffset = -Date.now() / 50; // Animated spin of the ring itself
    ctx.stroke();
    ctx.setLineDash([]);


    // 2. Draw User (Anchor Point)
    // We map 0 degrees to "Right".
    // If we have user location, let's fix User at the bottom (270 deg / -PI/2) or Right?
    //  Map Longitude -180..180 to circular angle.
    // 0 lon = 0 rad (Right).

    if (currentUser) {
        // Draw User
        const userAngle = (currentUser.lon * Math.PI) / 180;
        const ux = centerX + (radius - 15) * Math.cos(userAngle); // Slightly inside
        const uy = centerY + (radius - 15) * Math.sin(userAngle);

        drawMarker(ux, uy, THEME.user, "You (Lon " + currentUser.lon.toFixed(1) + "°)", false);

        // Draw Radial line to center (Gravity anchor)
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(ux, uy);
        ctx.strokeStyle = THEME.user;
        ctx.globalAlpha = 0.2;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
    }

    // 3. Draw ISS
    // Orbiting at Radius
    const issAngle = (currentIss.lon * Math.PI) / 180;
    const ix = centerX + radius * Math.cos(issAngle);
    const iy = centerY + radius * Math.sin(issAngle);

    // Pulse
    const pulse = 6 + Math.sin(Date.now() / 200) * 3;

    // Draw Radial line for ISS
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(ix, iy);
    ctx.strokeStyle = THEME.iss;
    ctx.globalAlpha = 0.3;
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    // Marker
    drawMarker(ix, iy, THEME.iss, "ISS", true);

    // Center Core (The "Imaginary Earth" Center)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
    ctx.fillStyle = THEME.orbit;
    ctx.fill();
}

function drawMarker(x, y, color, label, isPulse) {
    if (isPulse) {
        ctx.beginPath();
        ctx.arc(x, y, 6 + Math.sin(Date.now() / 200) * 2, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
    }

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();

    // Label
    if (label) {
        ctx.font = "10px 'Space Mono', monospace";
        ctx.fillStyle = color;
        // Text positioning logic to avoid overlap
        const xOff = x > centerX ? 10 : -10;
        ctx.textAlign = x > centerX ? "left" : "right";
        ctx.fillText(label, x + xOff, y + 4);
    }
}

window.updateGlobeData = function (iss, user) {
    if (iss) currentIss = iss;
    if (user) currentUser = user;
}

window.initModernGlobe = initModernGlobe;
