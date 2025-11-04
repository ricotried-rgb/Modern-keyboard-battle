// --- اطلاعات نیروها ---
let units = {
    soldier: 2,
    sniper: 2,
    tank: 2
};

// --- زمان تولید هر نیرو (میلی‌ثانیه) ---
const productionTimes = {
    soldier: 1500,
    sniper: 3000,
    tank: 6000
};

// --- داده‌های بازیکن ---
let player = {
    name: "",
    id: ""
};

// نمایش صفحه‌های بازی
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');

    if (screenId === 'base-screen') {
        updateUnitCounts();
        displayPlayerInfo();
    }
}

// به‌روزرسانی آمار نیروها
function updateUnitCounts() {
    document.getElementById('soldier-count').textContent = units.soldier;
    document.getElementById('sniper-count').textContent = units.sniper;
    document.getElementById('tank-count').textContent = units.tank;
}

// غیرفعال کردن دکمه‌ها هنگام تولید
function disableProductionButtons() {
    document.getElementById('produce-soldier-btn').disabled = true;
    document.getElementById('produce-sniper-btn').disabled = true;
    document.getElementById('produce-tank-btn').disabled = true;
}

// فعال کردن دکمه‌ها پس از پایان تولید
function enableProductionButtons() {
    document.getElementById('produce-soldier-btn').disabled = false;
    document.getElementById('produce-sniper-btn').disabled = false;
    document.getElementById('produce-tank-btn').disabled = false;
}

// شروع تولید نیرو
function startProduction(unitType) {
    const qtyInput = document.getElementById(`${unitType}-qty`);
    const quantity = parseInt(qtyInput.value, 10);
    const productionTime = productionTimes[unitType];
    const totalProductionTime = quantity * productionTime;

    if (quantity <= 0 || isNaN(quantity)) {
        alert("لطفاً یک عدد معتبر وارد کنید.");
        return;
    }

    disableProductionButtons();
    
    const statusDiv = document.getElementById('production-status');
    const unitNameFA = unitType === 'soldier' ? 'سرباز' : unitType === 'sniper' ? 'تک‌تیرانداز' : 'تانک';
    
    statusDiv.textContent = `تولید ${quantity} واحد ${unitNameFA} آغاز شد. زمان تقریبی: ${Math.ceil(totalProductionTime / 1000)} ثانیه.`;

    setTimeout(() => {
        units[unitType] += quantity;
        statusDiv.textContent = `✅ ${quantity} واحد ${unitNameFA} با موفقیت تولید و به پایگاه اضافه شد!`;
        enableProductionButtons();
        setTimeout(() => showScreen('base-screen'), 2000);
    }, totalProductionTime);
}

// --- تولید شناسه ۶ رقمی ---
function generatePlayerID() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// --- درخواست نام فارسی از کاربر ---
function askPlayerName() {
    let name = "";

    const persianRegex = /^[\u0600-\u06FF\s]+$/; // فقط حروف فارسی
    while (true) {
        name = prompt("👋 لطفاً نام خود را به فارسی وارد کنید:");
        if (name === null) continue;
        name = name.trim();
        if (name.length > 0 && persianRegex.test(name)) break;
        alert("⚠️ فقط حروف فارسی مجاز است!");
    }

    player.name = name;
    player.id = generatePlayerID();
    localStorage.setItem("mkb_player", JSON.stringify(player));
}

// نمایش اطلاعات بازیکن در بخش پایگاه
function displayPlayerInfo() {
    const infoEl = document.getElementById("player-info");
    if (player.name) {
        infoEl.innerHTML = `👤 نام فرمانده: <strong>${player.name}</strong><br>🆔 شناسه: <strong>${player.id}</strong>`;
    } else {
        infoEl.textContent = "";
    }
}

// اجرای اولیه
document.addEventListener("DOMContentLoaded", () => {
    showScreen('main-menu');
    updateUnitCounts();

    // بررسی ذخیره بازیکن قبلی
    const saved = localStorage.getItem("mkb_player");
    if (saved) {
        player = JSON.parse(saved);
    } else {
        askPlayerName();
    }
});
