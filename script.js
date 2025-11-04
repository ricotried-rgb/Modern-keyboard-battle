// داده‌های پایه‌ی نیروها در بازی
let gameData = {
    soldiers: 2,
    snipers: 2,
    tanks: 2
};

// زمان ساخت هر نیرو بر حسب ثانیه
const productionTime = {
    soldiers: 1.5,
    snipers: 3,
    tanks: 6
};

// ========= تابع کمک‌کننده برای نمایش و پنهان‌سازی =========
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(el => el.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
}

// ====== بروزرسانی اطلاعات پایگاه ======
function updateBaseScreen() {
    document.getElementById('soldier-count').textContent = gameData.soldiers;
    document.getElementById('sniper-count').textContent = gameData.snipers;
    document.getElementById('tank-count').textContent = gameData.tanks;
}

// ====== تابع برای ریست کردن ورودی‌ها ======
function resetProduceInputs() {
    document.getElementById('soldier-input').value = 0;
    document.getElementById('sniper-input').value = 0;
    document.getElementById('tank-input').value = 0;
}

// ====== محاسبه زمان کل ======
function calculateTotalTime() {
    let soldiers = parseInt(document.getElementById('soldier-input').value) || 0;
    let snipers = parseInt(document.getElementById('sniper-input').value) || 0;
    let tanks = parseInt(document.getElementById('tank-input').value) || 0;

    let total =
        soldiers * productionTime.soldiers +
        snipers * productionTime.snipers +
        tanks * productionTime.tanks;

    document.getElementById('total-time').textContent = total.toFixed(1);
}


// ========= مقداردهی و رویدادها =========
document.addEventListener('DOMContentLoaded', () => {
    // ----- دکمه‌های منوی اصلی -----
    document.getElementById('base-btn').addEventListener('click', () => {
        updateBaseScreen();
        showScreen('base-screen');
    });

    document.getElementById('attack-btn').addEventListener('click', () => showScreen('attack-screen'));

    document.getElementById('about-btn').addEventListener('click', () => showScreen('about-screen'));

    document.getElementById('produce-btn').addEventListener('click', () => {
        resetProduceInputs();
        calculateTotalTime();
        showScreen('produce-screen');
    });

    // ----- دکمه‌های بازگشت -----
    document.getElementById('back-from-base').addEventListener('click', () => showScreen('main-menu'));
    document.getElementById('back-from-attack').addEventListener('click', () => showScreen('main-menu'));
    document.getElementById('back-from-about').addEventListener('click', () => showScreen('main-menu'));
    document.getElementById('back-from-produce').addEventListener('click', () => showScreen('main-menu'));


    // هر بار کاربر عددی وارد کرد → محاسبه مجدد زمان
    ['soldier-input', 'sniper-input', 'tank-input'].forEach(id =>
        document.getElementById(id).addEventListener('input', calculateTotalTime)
    );

    // ====== شروع تولید (با زمان‌سنجی واقعی) ======
    document.getElementById('start-production').addEventListener('click', () => {
        let soldiersToProduce = parseInt(document.getElementById('soldier-input').value) || 0;
        let snipersToProduce = parseInt(document.getElementById('sniper-input').value) || 0;
        let tanksToProduce = parseInt(document.getElementById('tank-input').value) || 0;

        if (soldiersToProduce + snipersToProduce + tanksToProduce === 0) {
            alert("⚠️ حداقل یک نیرو وارد کن، امیر!");
            return;
        }

        let totalTimeSeconds =
            soldiersToProduce * productionTime.soldiers +
            snipersToProduce * productionTime.snipers +
            tanksToProduce * productionTime.tanks;
        
        // تبدیل زمان به میلی‌ثانیه برای setTimeout
        let totalTimeMilliseconds = totalTimeSeconds * 1000;

        // پیغام شروع تولید
        alert(`✅ تولید نیرو شروع شد!\nسرباز: ${soldiersToProduce}، تک‌تیرانداز: ${snipersToProduce}، تانک: ${tanksToProduce}\nمجموعاً ${totalTimeSeconds.toFixed(1)} ثانیه زمان نیاز است.`);

        // غیرفعال کردن موقت دکمه (این قسمت رو بهتره بعداً با نوار پیشرفت عوض کنیم)
        document.getElementById('start-production').disabled = true;

        // استفاده از setTimeout برای اضافه کردن نیروها پس از اتمام زمان
        setTimeout(() => {
            // افزایش نیروها پس از اتمام زمان
            gameData.soldiers += soldiersToProduce;
            gameData.snipers += snipersToProduce;
            gameData.tanks += tanksToProduce;

            // فعال‌سازی مجدد دکمه
            document.getElementById('start-production').disabled = false;

            // نمایش پیغام تکمیل
            alert(`🎉 تولید ${soldiersToProduce + snipersToProduce + tanksToProduce} نیرو با موفقیت انجام شد و به پایگاه اضافه شدند!`);
            
            // اگر کاربر در صفحه پایگاه بود، آمار به‌روز شود
            if (!document.getElementById('base-screen').classList.contains('hidden')) {
                updateBaseScreen();
            }

        }, totalTimeMilliseconds);
        
        // برگشت به منوی اصلی بلافاصله پس از شروع تایمر
        showScreen('main-menu');
    });

    // آغاز با منوی اصلی
    showScreen('main-menu');
});
