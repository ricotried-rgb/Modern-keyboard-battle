/**
 * game.js - Logics for the HTML5 Space Game (Final Version with Enemies & Collision)
 * Author: GapGPT (for Amir 👑 🚀)
 */

// --- Game Setup ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');

// Set canvas dimensions
function resizeCanvas() {
    canvas.width = 800;
    canvas.height = 600;
}
resizeCanvas();

// Game State
let gameRunning = false;
let animationFrameId = null;

// Player State (Red Triangular Spaceship)
const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    size: 20, 
    speed: 5,
};

// Input State
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    KeyW: false,
    KeyS: false,
    KeyA: false,
    KeyD: false,
    Space: false,
};

// --- Bullet State ---
const bullets = [];
const bulletSpeed = 7;
const bulletSize = 3; 

// --- NEW: Enemy State ---
const enemies = [];
const enemySize = 30; // 30x30 pixels for the enemy square

/**
 * NEW: Creates a simple grid of enemies at the start.
 */
function createEnemies() {
    // Clear any existing enemies
    enemies.length = 0; 
    
    const rows = 3;
    const cols = 8;
    const padding = 50;
    const offset = 40;
    const totalWidth = cols * (enemySize + padding);
    const startX = (canvas.width - totalWidth) / 2 + padding / 2;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            enemies.push({
                x: startX + j * (enemySize + padding),
                y: offset + i * (enemySize + padding),
                width: enemySize,
                height: enemySize,
                isAlive: true,
            });
        }
    }
}

/**
 * Renders the player (Red Triangle Spaceship).
 */
function drawPlayer() {
    ctx.fillStyle = '#e74c3c'; // Red Spaceship color
    ctx.beginPath();
    ctx.moveTo(player.x, player.y - player.size);
    ctx.lineTo(player.x + player.size, player.y + player.size);
    ctx.lineTo(player.x - player.size, player.y + player.size);
    ctx.closePath();
    ctx.fill();
}

/**
 * Renders all active bullets.
 */
function drawBullets() {
    ctx.fillStyle = '#f1c40f'; // Yellow/Gold Bullet Color
    for (const bullet of bullets) {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bulletSize, 0, Math.PI * 2);
        ctx.fill();
    }
}

/**
 * NEW: Renders all living enemies (Green Squares).
 */
function drawEnemies() {
    ctx.fillStyle = '#2ecc71'; // Green Enemy Color
    for (const enemy of enemies) {
        if (enemy.isAlive) {
            ctx.fillRect(enemy.x - enemySize / 2, enemy.y - enemySize / 2, enemySize, enemySize);
        }
    }
}

/**
 * Creates a new bullet object and adds it to the bullets array.
 */
function shoot() {
    if (!gameRunning) return;

    const newBullet = {
        x: player.x,
        y: player.y - player.size,
        // Mark the bullet as active
        isAlive: true
    };
    bullets.push(newBullet);
}

/**
 * Checks for collision between a bullet and all enemies.
 */
function checkCollisions() {
    // Iterate backwards for safe removal
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        
        // Skip dead bullets
        if (!bullet.isAlive) continue;

        let bulletHit = false;

        // Check collision against all enemies
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            
            // Skip dead enemies
            if (!enemy.isAlive) continue;

            // Simple Axis-Aligned Bounding Box (AABB) collision for simplicity
            // Enemy bounds: [x-size/2, y-size/2] to [x+size/2, y+size/2]
            const enemyLeft = enemy.x - enemy.width / 2;
            const enemyRight = enemy.x + enemy.width / 2;
            const enemyTop = enemy.y - enemy.height / 2;
            const enemyBottom = enemy.y + enemy.height / 2;
            
            // Check if bullet's center is within enemy's boundaries
            if (bullet.x >= enemyLeft && 
                bullet.x <= enemyRight && 
                bullet.y >= enemyTop && 
                bullet.y <= enemyBottom) {
                
                // Collision detected!
                bulletHit = true;
                enemy.isAlive = false; // Destroy the enemy
                break; // A bullet can only hit one enemy
            }
        }

        // If collision happened, destroy the bullet
        if (bulletHit) {
            bullets.splice(i, 1);
        }
    }
    
    // Clean up enemies that are no longer alive (optional, but good for performance)
    // We will keep them in the array for now to show the space they occupied.
}


/**
 * Updates the player's position, bullet positions, and handles boundaries.
 */
function update() {
    // 1. Player Movement (Same as before)
    let dx = 0;
    let dy = 0;

    if (keys.ArrowLeft || keys.KeyA) dx -= player.speed;
    if (keys.ArrowRight || keys.KeyD) dx += player.speed;
    if (keys.ArrowUp || keys.KeyW) dy -= player.speed;
    if (keys.ArrowDown || keys.KeyS) dy += player.speed;

    player.x += dx;
    player.y += dy;

    // Keep player within canvas bounds
    player.x = Math.max(player.size, Math.min(canvas.width - player.size, player.x));
    player.y = Math.max(player.size, Math.min(canvas.height - player.size, player.y));

    // 2. Bullet Logic (Movement and Cleanup)
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bulletSpeed;

        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
        }
    }

    // 3. NEW: Check for collisions
    checkCollisions();
}


/**
 * Main game loop, handles updates and drawing at ~60fps.
 */
function gameLoop() {
    // 1. Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Update all game objects (movement, collision, etc.)
    update();
    
    // 3. Draw all game objects
    drawEnemies(); // NEW: Draw Enemies
    drawPlayer();
    drawBullets(); 

    // 4. Request the next frame
    animationFrameId = requestAnimationFrame(gameLoop);
}

/**
 * Starts the game. (Initializes Enemies)
 */
function startGame() {
    if (gameRunning) return; 
    console.log("🔥 بازی فضایی شروع شد!");

    if (startButton) {
        startButton.style.display = 'none';
    }
    if (stopButton) {
        stopButton.style.display = 'block';
    }

    // Initialize/Reset Enemies
    createEnemies();

    // Reset player position
    player.x = canvas.width / 2;
    player.y = canvas.height - 50;
    bullets.length = 0; // Clear old bullets

    gameRunning = true;
    gameLoop(); 
}


// --- Event Listeners for Input ---

// Handles key down events (press)
document.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = true;
    }
    
    // Handle shooting only when Space is pressed
    if (e.code === 'Space' && !e.repeat) { 
        shoot(); 
        e.preventDefault(); 
    }
});

// Handles key up events (release)
document.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = false;
    }
});


// --- Initialization ---

// 1. Link the button to the start function
if (startButton) {
    startButton.addEventListener('click', startGame);
    if (stopButton) stopButton.style.display = 'none';
} else {
    // FALLBACK: If the start button is not found, start automatically.
    console.warn("Start button not found. Starting game automatically.");
    startGame();
}


// 2. Initial draw
drawPlayer();
