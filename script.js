// Game state (Niroo Inventory)
let units = {
    soldier: 2,
    sniper: 2,
    tank: 2
};

// Production times in milliseconds
const productionTimes = {
    soldier: 1500, // 1.5 seconds
    sniper: 3000, // 3 seconds
    tank: 6000     // 6 seconds
};

// Function to switch between game screens
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    // Show the requested screen
    document.getElementById(screenId).classList.add('active');

    // Update counts when entering base screen
    if (screenId === 'base-screen') {
        updateUnitCounts();
    }
}

// Function to update the displayed unit counts on the Base Screen
function updateUnitCounts() {
    document.getElementById('soldier-count').textContent = units.soldier;
    document.getElementById('sniper-count').textContent = units.sniper;
    document.getElementById('tank-count').textContent = units.tank;
}

// Function to disable all production buttons
function disableProductionButtons() {
    document.getElementById('produce-soldier-btn').disabled = true;
    document.getElementById('produce-sniper-btn').disabled = true;
    document.getElementById('produce-tank-btn').disabled = true;
}

// Function to enable all production buttons
function enableProductionButtons() {
    document.getElementById('produce-soldier-btn').disabled = false;
    document.getElementById('produce-sniper-btn').disabled = false;
    document.getElementById('produce-tank-btn').disabled = false;
}

// Main function to start the production process
function startProduction(unitType) {
    const qtyInput = document.getElementById(`${unitType}-qty`);
    const quantity = parseInt(qtyInput.value, 10);
    const productionTime = productionTimes[unitType];
    const totalProductionTime = quantity * productionTime;

    if (quantity <= 0 || isNaN(quantity)) {
        alert("لطفاً یک عدد معتبر وارد کنید.");
        return;
    }

    // Disable buttons during production
    disableProductionButtons();
    
    const statusDiv = document.getElementById('production-status');
    const unitNameFA = unitType === 'soldier' ? 'سرباز' : unitType === 'sniper' ? 'تک‌تیرانداز' : 'تانک';
    
    statusDiv.textContent = `تولید ${quantity} واحد ${unitNameFA} آغاز شد. زمان تقریبی: ${Math.ceil(totalProductionTime / 1000)} ثانیه.`;

    // Start the timer
    setTimeout(() => {
        // Add units to inventory after the time delay
        units[unitType] += quantity;
        
        statusDiv.textContent = `✅ ${quantity} واحد ${unitNameFA} با موفقیت تولید و به پایگاه اضافه شد!`;
        
        // Re-enable buttons
        enableProductionButtons();
        
        // Update counts (optional, done automatically when returning to base screen)
        // updateUnitCounts(); 

        // Automatically return to the base screen after a short delay (e.g., 2 seconds)
        setTimeout(() => {
            showScreen('base-screen');
        }, 2000); 

    }, totalProductionTime);
}

// Initialize: Ensure the main menu is shown on load
document.addEventListener('DOMContentLoaded', () => {
    showScreen('main-menu');
    updateUnitCounts(); // Initial update
});
