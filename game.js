// 1. تنظیمات اولیه بوم (Canvas)
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d'); // context دو بعدی

// 2. تعریف کاراکتر بازیکن و وضعیت بازی
let player = {
    x: canvas.width / 2, 
    y: canvas.height - 50, 
    size: 20, 
    speed: 5,
    color: '#e74c3c' // رنگ قرمز جذاب‌تر
};

let gameRunning = false; // پرچم وضعیت بازی
let keys = {}; // شیء برای نگهداری وضعیت کلیدهای فشرده شده
let animationFrameId; // برای نگه داشتن ID حلقه بازی

// 3. مدیریت ورودی کیبورد
// ثبت کلید فشرده شده
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

// حذف کلید رها شده
document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// 4. تابع به‌روزرسانی موقعیت (Movement Logic)
function update() {
    if (!gameRunning) return; // اگر بازی شروع نشده، حرکت نده

    // حرکت به چپ (Left Arrow یا 'a')
    if (keys['ArrowLeft'] || keys['a']) {
        player.x -= player.speed;
    }
    
    // حرکت به راست (Right Arrow یا 'd')
    if (keys['ArrowRight'] || keys['d']) {
        player.x += player.speed;
    }

    // حرکت به بالا (Up Arrow یا 'w')
    if (keys['ArrowUp'] || keys['w']) {
        player.y -= player.speed;
    }

    // حرکت به پایین (Down Arrow یا 's')
    if (keys['ArrowDown'] || keys['s']) {
        player.y += player.speed;
    }

    // محدود کردن بازیکن به مرزهای Canvas (برای جلوگیری از خروج سفینه از صفحه)
    // محدودیت افقی
    if (player.x < player.size) player.x = player.size; // از player.size/2 به player.size تغییر دادم چون سفینه مثلث است و نقطه x مرکز نیست
    if (player.x > canvas.width - player.size) player.x = canvas.width - player.size;
    // محدودیت عمودی
    if (player.y < player.size) player.y = player.size;
    if (player.y > canvas.height - player.size) player.y = canvas.height - player.size;
}


// 5. تابع اصلی رسم (Drawing function)
function drawPlayer() {
    ctx.fillStyle = player.color;
    
    // رسم یک مثلث (سفینه فضایی)
    ctx.beginPath();
    // راس بالا
    ctx.moveTo(player.x, player.y - player.size);
    // گوشه پایین چپ
    ctx.lineTo(player.x - player.size, player.y + player.size);
    // گوشه پایین راست
    ctx.lineTo(player.x + player.size, player.y + player.size);
    ctx.closePath();
    ctx.fill();
}

// 6. تابع اصلی حلقه بازی (Game Loop)
function gameLoop() {
    if (!gameRunning) return;

    // 1. به‌روزرسانی منطق بازی (حرکت)
    update();

    // 2. پاک کردن صفحه در هر فریم
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    
    // 3. رسم کاراکتر
    drawPlayer();

    // 4. درخواست فریم بعدی برای حرکت روان
    animationFrameId = requestAnimationFrame(gameLoop);
}

// 7. مدیریت دکمه‌های کنترل
document.getElementById('startButton').addEventListener('click', () => {
    if (gameRunning) return; 
    
    alert("🔥 بازی فضایی شروع شد! با کلیدهای جهت‌نما یا WASD حرکت کنید.");
    
    // تنظیم وضعیت
    gameRunning = true;
    document.getElementById('startButton').disabled = true;
    document.getElementById('stopButton').disabled = false;
    
    // شروع حلقه بازی
    gameLoop();
});

document.getElementById('stopButton').addEventListener('click', () => {
    if (!gameRunning) return;

    alert("بازی متوقف شد.");
    
    // توقف حلقه بازی
    cancelAnimationFrame(animationFrameId);
    
    // تنظیم وضعیت
    gameRunning = false;
    document.getElementById('startButton').disabled = false;
    document.getElementById('stopButton').disabled = true;
});

// اولین رسم در هنگام بارگذاری (نمایش سفینه در حالت سکون)
drawPlayer();
