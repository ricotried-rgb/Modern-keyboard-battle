// ===== تنظیمات نیرو =====
let units = { soldier: 2, sniper: 2, tank: 2 };

const productionTimes = {
    soldier: 1500,
    sniper: 3000,
    tank: 6000
};

// ===== اطلاعات بازیکن =====
let player = { name: "", id: "" };

// ===== خزانه =====
let coinBalance = 100;

// ===== ذخیره مجتمع (Auto Save کل داده بازی) =====
function saveGame() {
    const gameData = {
        player,
        units,
        coinBalance
    };
    localStorage.setItem("mkb_full_save", JSON.stringify(gameData));
}

// ===== بارگذاری بازی =====
function loadGame() {
    const saved = localStorage.getItem("mkb_full_save");
    if (saved) {
        try {
            const data = JSON.parse(saved);
            if (data.player) player = data.player;
            if (data.units) units = data.units;
            if (typeof data.coinBalance === "number") coinBalance = data.coinBalance;
        } catch {
            console.warn("🚫 خطا در بارگذاری ذخیره، بازی از نو شروع شد.");
        }
    } else {
        askPlayerName(); // اگر هیچ ذخیره‌ای نباشد، درخواست نام
        saveGame();      // شروع با مقدار اولیه
    }
}

// ===== ذخیره هنگام خروج =====
window.addEventListener("beforeunload", saveGame);

// ===== نمایش/تغییر صفحات =====
function showScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");

    if (id === "base-screen") {
        updateUnitCounts();
        displayPlayerInfo();
    }

    if (id === "vault-screen") {
        updateVaultDisplay();
    }
}

function updateUnitCounts() {
    document.getElementById("soldier-count").textContent = units.soldier;
    document.getElementById("sniper-count").textContent = units.sniper;
    document.getElementById("tank-count").textContent = units.tank;
}

// ===== تولید نیرو =====
function disableProductionButtons() {
    document.querySelectorAll("#produce-screen button").forEach(b => b.disabled = true);
}
function enableProductionButtons() {
    document.querySelectorAll("#produce-screen button").forEach(b => b.disabled = false);
}

function startProduction(type) {
    const qty = parseInt(document.getElementById(`${type}-qty`).value);
    const time = productionTimes[type];
    const totalTime = qty * time;

    if (isNaN(qty) || qty <= 0) {
        alert("تعداد معتبر نیست!");
        return;
    }

    disableProductionButtons();
    const status = document.getElementById("production-status");
    const faType = type === "soldier" ? "سرباز" : type === "sniper" ? "تک‌تیرانداز" : "تانک";
    status.textContent = `در حال ساخت ${qty} ${faType}... (${Math.ceil(totalTime / 1000)} ثانیه)`;

    setTimeout(() => {
        units[type] += qty;
        status.textContent = `✅ ${qty} ${faType} آماده شد!`;
        enableProductionButtons();
        saveGame(); // ذخیره پس از اتمام تولید
        setTimeout(() => showScreen("base-screen"), 2000);
    }, totalTime);
}

// ===== نام کاربر =====
function generatePlayerID() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function askPlayerName() {
    const regex = /^[\u0600-\u06FF\s]+$/; // فقط فارسی
    let name = "";
    while (true) {
        name = prompt("👋 خوش آمدی! لطفاً نام خود را به فارسی وارد کن:");
        if (!name) continue;
        name = name.trim();
        if (regex.test(name)) break;
        alert("⚠️ فقط حروف فارسی مجاز است!");
    }
    const id = generatePlayerID();
    player = { name, id };
    coinBalance = 100;
    units = { soldier: 2, sniper: 2, tank: 2 };
    saveGame();
}

// ===== نمایش در پایگاه =====
function displayPlayerInfo() {
    const info = document.getElementById("player-info");
    info.innerHTML = `👤 فرمانده: <b>${player.name}</b><br>🆔 شناسه: <b>${player.id}</b>`;
}

// ===== خزانه =====
function saveVault() {
    saveGame(); // همه‌چیز یکجا ذخیره میشه
}

function updateVaultDisplay() {
    document.getElementById("coin-amount").textContent = coinBalance.toFixed(1);
}

// افزودن خودکار ۰٫۱ سکه هر دقیقه
setInterval(() => {
    coinBalance += 0.1;
    saveGame(); // ذخیره بعد از اضافه شدن سکه
    const vaultPage = document.getElementById("vault-screen");
    if (vaultPage.classList.contains("active")) updateVaultDisplay();
}, 60000);

// ===== آغاز =====
document.addEventListener("DOMContentLoaded", () => {
    loadGame(); // بارگذاری همه اطلاعات از localStorage
    showScreen("main-menu");
    updateUnitCounts();
});
