//Imports


// Initialize the game state
let gameState = {
    clicks: 0,
    cash: 0,
    cashOutMulti: .15
};

//Early Initializations
let maxCashOut = formatCash(gameState.clicks * gameState.cashOutMulti);

// Collect Button
document.getElementById('collect-btn').addEventListener('click', function () {
    gameState.clicks++;
    // Update the counter display
    document.getElementById('bCounter').innerText = formatBytes(gameState.clicks);
});
// Cash Out Button
document.getElementById('cashout-btn').addEventListener('click', function () {
    gameState.cash = gameState.cash + (gameState.clicks * gameState.cashOutMulti);
    gameState.clicks = 0;
    // Update the counters
    document.getElementById('cashCounter').innerText = formatCash(gameState.cash);
    document.getElementById('bCounter').innerText = formatBytes(gameState.clicks);
});

//Slider for CashOut
let slider = document.getElementById("cashOutRange");
slider.max = maxCashOut;
slider.value = maxCashOut; //Initial Value
let output = document.getElementById("cashOutVal");
//Display Default Slider Value
output.innerHTML = slider.value;
// Update the slider value (each time you drag the slider handle)
slider.oninput = function () {
    output.innerHTML = this.value;
}

// Define the units and their thresholds
const units = [
    { name: 'Bytes', limit: 1000 },
    { name: 'kB', limit: 1000 ** 2 },
    { name: 'MB', limit: 1000 ** 3 },
    { name: 'GB', limit: 1000 ** 4 },
    { name: 'TB', limit: 1000 ** 5 },
    { name: 'PB', limit: 1000 ** 6 },
    { name: 'EB', limit: 1000 ** 7 },
    { name: 'ZB', limit: 1000 ** 8 },
    { name: 'YB', limit: 1000 ** 9 },
    { name: 'RB', limit: 1000 ** 10 },
    { name: 'QB', limit: Infinity }
];

function formatBytes(bytes) {
    // handle bits separately for amounts less than 1 byte
    if (bytes < 8) {
        return `${bytes} Bits`;
    }

    // handle the special case of less than 1 kB in bytes and bits
    if (bytes < 1000) {
        return `${Math.floor(bytes / 8)} Bytes ${bytes % 8} Bits`;
    }

    // for amounts of 1 kB and more, find the appropriate unit
    let unitIndex = 1; // start at kB
    while (bytes >= units[unitIndex].limit) {
        unitIndex++;
    }

    // calculate the amount in the chosen unit
    const amountInUnit = bytes / units[unitIndex - 1].limit;

    // return a string with the amount rounded to two decimal places, followed by the unit
    return `${amountInUnit.toFixed(2)} ${units[unitIndex - 1].name}`;
}

function formatCash(cash) {
    let i = 0;
    const suffixes = ['', 'K', 'M', 'B', 'T'];

    while (cash >= 1000 && i < suffixes.length) {
        cash /= 1000;
        i++;
    }
    return `$${cash.toFixed(2)} ${suffixes[i]}`;
}