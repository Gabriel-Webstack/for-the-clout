const canvas = document.getElementById('rainCanvas');
const ctx = canvas.getContext('2d');
const display = document.getElementById('lyric-display');
const audio = document.getElementById('bgMusic');
const video = document.getElementById('bgVideo');
const overlay = document.getElementById('overlay');
const fallingContainer = document.getElementById('falling-memes-container');

const memeImages = [
    'images (33).jpg',
    'images (2).jpg',
    'images (22).jpg',
    'crying-cat-meme-template-thumbnail-4e806a85.webp'
];

const lyricsData = [
    { time: 0.5, text: "maybe i'll get famous..." },
    { time: 2.8, text: "as the man who can't be moved" },
    { time: 5.5, text: "maybe you won't mean to" },
    { time: 8.0, text: "but you'll see me on the news" },
    { time: 10.5, text: "and you'll come running to the corner" },
    { time: 13.5, text: "'cause you'll know it's just for you" },
    { time: 16.5, text: "i'm the man who can't be moved" },
    { time: 21.5, text: "i'm the man who can't be moved" }
];

function startExperience() {
    overlay.style.display = 'none';
    video.play();
    audio.play();
    drawRain();
    setInterval(createFallingMeme, 1500); 
    syncLyrics();
}

async function typeWriter(text) {
    display.innerHTML = "";
    for (let i = 0; i < text.length; i++) {
        display.innerHTML += text.charAt(i);
        await new Promise(res => setTimeout(res, 40)); 
    }
}

let currentLine = -1;
function syncLyrics() {
    audio.addEventListener('timeupdate', () => {
        const lineToPlay = lyricsData.findLastIndex(l => audio.currentTime >= l.time);
        if (lineToPlay !== currentLine && lineToPlay !== -1) {
            currentLine = lineToPlay;
            typeWriter(lyricsData[currentLine].text);
        }
    });
}

// --- HEAVY RAIN LOGIC ---
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Increase length to 250 for heavy rain
let drops = Array.from({length: 250}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speed: Math.random() * 10 + 10, // Faster falling
    len: Math.random() * 20 + 10,  // Longer drops
    opacity: Math.random() * 0.4 + 0.1
}));

function drawRain() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drops.forEach(d => {
        ctx.strokeStyle = `rgba(255, 255, 255, ${d.opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x, d.y + d.len);
        ctx.stroke();
        
        d.y += d.speed;
        if (d.y > canvas.height) {
            d.y = -20;
            d.x = Math.random() * canvas.width;
        }
    });
    requestAnimationFrame(drawRain);
}

// Update canvas size on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

function createFallingMeme() {
    const img = document.createElement('img');
    img.src = memeImages[Math.floor(Math.random() * memeImages.length)];
    img.className = 'falling-meme';
    const size = Math.random() * 60 + 100;
    img.style.width = size + 'px';
    img.style.left = Math.random() * (window.innerWidth - size) + 'px';
    fallingContainer.appendChild(img);

    let pos = -250;
    function fall() {
        pos += 3; 
        img.style.top = pos + 'px';
        img.style.transform = `rotate(${pos / 5}deg)`;
        if (pos < window.innerHeight + 300) {
            requestAnimationFrame(fall);
        } else {
            img.remove();
        }
    }
    fall();
}