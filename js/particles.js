const canvas = document.getElementById('space-background');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// Mouse tracking
let mouse = {
    x: undefined,
    y: undefined,
    radius: 150
};

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

// Resize canvas
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

let oldWidth = window.innerWidth;
window.addEventListener('resize', () => {
    if (window.innerWidth !== oldWidth) {
        oldWidth = window.innerWidth;
        resize();
        initParticles();
    }
});

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5; // Star sizes
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
        this.color = this.getRandomColor();
    }

    getRandomColor() {
        const colors = [
            'rgba(255, 255, 255, 0.8)', // White
            'rgba(0, 243, 255, 0.6)',   // Cyan
            'rgba(157, 78, 221, 0.6)'    // Purple
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    draw(scrollSpeed) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        
        let stretch = this.size;
        // If scrolling heavily, stretch the particles vertically to create lightspeed streaks
        if (Math.abs(scrollSpeed) > 0.5) {
            stretch = this.size + Math.abs(scrollSpeed) * 3;
        }

        ctx.ellipse(this.x, this.y, this.size, stretch, 0, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        
        if(this.size > 1.5) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
        } else {
            ctx.shadowBlur = 0;
        }
    }

    update(scrollSpeed) {
        // Slow constant drift
        let driftY = 0.2 * (this.size / 2);
        let scrollShift = scrollSpeed * (this.size * 0.8);

        this.baseY -= driftY;
        // Apply scroll directly onto both bases to avoid 20-frame lag
        this.baseY -= scrollShift;
        this.y -= scrollShift; 

        if (this.baseY < -50) {
            this.baseY = height + 50;
            this.baseX = Math.random() * width;
            this.x = this.baseX; // Snap so they don't drag across center
            this.y = this.baseY;
        } else if (this.baseY > height + 50) {
            this.baseY = -50;
            this.baseX = Math.random() * width;
            this.x = this.baseX;
            this.y = this.baseY;
        }

        // Mouse interaction
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX) {
                let diffX = this.x - this.baseX;
                this.x -= diffX / 20;
            }
            if (this.y !== this.baseY) {
                let diffY = this.y - this.baseY;
                this.y -= diffY / 20;
            }
        }
        
        // Ensure particles draw even when untouched by mouse
        this.draw(scrollSpeed);
    }
}

function initParticles() {
    particles = [];
    const numberOfParticles = (width * height) / 9000; 
    for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
    }
}

let lastScrollY = window.scrollY;
let scrollSpeed = 0;

function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    // Calculate velocity of scroll per frame maps perfectly
    const currentScrollY = window.scrollY;
    const deltaY = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    // Smooth speed transitions (easing)
    scrollSpeed += (deltaY - scrollSpeed) * 0.15;
    if (Math.abs(scrollSpeed) < 0.1) scrollSpeed = 0;

    for (let i = 0; i < particles.length; i++) {
        particles[i].update(scrollSpeed);
    }
    requestAnimationFrame(animateParticles);
}

// Start
resize();
initParticles();
animateParticles();
