// Imports


// Wrap the code in a DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', (event) => {


    // Initialize the game state
    let gameState = {
        clicks: 0,
        cash: 100,
        cashOutMulti: .0015,
        dFarmers: 0,
        dFarmerTickIncrement: 1000,
        level: 1,
        exp: 0
    };
    // Early Initializations
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    let maxCashOut = formatCash(gameState.clicks * gameState.cashOutMulti);
    let output = document.getElementById("cashOutVal");
    output.innerHTML = maxCashOut;
    let autoGenPerSec = gameState.dFarmers / (gameState.dFarmerTickIncrement / 1000); // Per sec calc
    let autoGenOutput = document.getElementById('autoGenText');
    autoGenOutput.innerHTML = formatBytes(autoGenPerSec); // Set intial Auto Gen Text
    let nextLevelReqExp = ((gameState.level * 100) * (gameState.level ^ 2));
    let expOutput = document.getElementById('expCounter');
    expOutput.innerHTML = formatExp(gameState.exp,nextLevelReqExp); // Update Exp Text
    let levelTextRef = document.getElementById('levelText');
    levelTextRef.innerHTML = `${gameState.level}`; // Update Level Text
    let expBar = document.getElementById('expBar');
    let progressPercentage = (gameState.exp / nextLevelReqExp) * 100; // Calc Progress Percentage

    // Clock
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    setInterval(function () {
        gameState.clicks += gameState.dFarmers;
        gameState.exp += gameState.dFarmers;
        levelUpCheck(); // Check for level up
        document.getElementById('bCounter').innerText = formatBytes(gameState.clicks);  // Update the counter display
        output.innerHTML = formatCash(gameState.clicks * gameState.cashOutMulti);   // Update the Cash Out Value
        expOutput.innerHTML = formatExp(gameState.exp, nextLevelReqExp); // Update Exp Text
    }, gameState.dFarmerTickIncrement);

    // Buttons
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    // Collect Button
    document.getElementById('collect-btn').addEventListener('click', function () {
        gameState.clicks++;
        gameState.exp++;
        levelUpCheck(); // Check for level up
        document.getElementById('bCounter').innerText = formatBytes(gameState.clicks);  // Update the counter display
        output.innerHTML = formatCash(gameState.clicks * gameState.cashOutMulti);   // Update the Cash Out Value
        expOutput.innerHTML = formatExp(gameState.exp, nextLevelReqExp); // Update Exp Text
    });

    // Cash Out Button
    document.getElementById('cashout-btn').addEventListener('click', function () {
        let cashToAdd = (gameState.clicks * gameState.cashOutMulti);
        gameState.cash = gameState.cash + cashToAdd;
        gameState.clicks = 0;
        document.getElementById('cashCounter').innerText = formatCash(gameState.cash);  // Update the Total Cash display
        document.getElementById('bCounter').innerText = formatBytes(gameState.clicks);  // Update the counter display
        output.innerHTML = formatCash(gameState.clicks * gameState.cashOutMulti);   // Update the Cash Out Value
    });

    // Data Farmers
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    document.getElementById('buyDFarmer1-btn').addEventListener('click', function () {
        gameState.dFarmers++;
        document.getElementById('dFarmerTotal').innerText = gameState.dFarmers;
        autoGenPerSec = gameState.dFarmers / (gameState.dFarmerTickIncrement / 1000); // ReCalc Auto Gen
        autoGenOutput.innerHTML = formatBytes(autoGenPerSec);    // Update Auto Gen Text
    });
    document.getElementById('buyDFarmer10-btn').addEventListener('click', function () {
        gameState.dFarmers += 10;
        document.getElementById('dFarmerTotal').innerText = gameState.dFarmers;
        autoGenPerSec = gameState.dFarmers / (gameState.dFarmerTickIncrement / 1000); //ReCalc Auto Gen
        autoGenOutput.innerHTML = formatBytes(autoGenPerSec);    // Update Auto Gen Text
    });
    document.getElementById('buyDFarmer100-btn').addEventListener('click', function () {
        gameState.dFarmers += 100;
        document.getElementById('dFarmerTotal').innerText = gameState.dFarmers;
        autoGenPerSec = gameState.dFarmers / (gameState.dFarmerTickIncrement / 1000); //ReCalc Auto Gen
        autoGenOutput.innerHTML = formatBytes(autoGenPerSec);    // Update Auto Gen Text
    });

    // Leveling
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    function levelUpCheck() {
        progressPercentage = (gameState.exp / nextLevelReqExp) * 100; // ReCalc Progress Percentage
        expBar.style.width = progressPercentage + "%"; // Update Exp Bar
        expBar.setAttribute('aria-valuenow', progressPercentage); // Update Exp Bar

        if (gameState.exp >= nextLevelReqExp) {
            gameState.level++;
            nextLevelReqExp = ((gameState.level * 100) * (gameState.level ** 2)); // ReCalc Next Level Req Exp
            progressPercentage = (gameState.exp / nextLevelReqExp) * 100; // ReCalc Progress Percentage
            expBar.style.width = progressPercentage + "%"; // Update Exp Bar
            expBar.setAttribute('aria-valuenow', progressPercentage); // Update Exp Bar
            levelTextRef.innerHTML = `${gameState.level}`; // Update Level Text
            expOutput.innerHTML = formatExp(gameState.exp, nextLevelReqExp); // Update Exp Text
        }
    }

    // Formatting Funtions:
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    // Byte Formatting Array
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
        // handle the special case of less than 1 kB in bytes
        if (bytes < 1000) {
            return `${bytes} Bytes`;
        }

        // for amounts of 1 kB and more, find the appropriate unit
        let unitIndex = 1;
        while (bytes >= units[unitIndex].limit) {
            unitIndex++;
        }

        // calculate the amount in the chosen unit
        const amountInUnit = bytes / units[unitIndex - 1].limit;

        // return a string with the amount rounded to two decimal places, followed by the unit
        return `${amountInUnit.toFixed(2)} ${units[unitIndex].name}`;
    }

    function formatExp(exp,nextLevelReq) {return `${exp} / ${nextLevelReq}`;}

    function formatCash(cash) {
        let i = 0;
        const suffixes = ['', 'K', 'M', 'B', 'T'];

        while (cash >= 1000 && i < suffixes.length) {
            cash /= 1000;
            i++;
        }
        return `$${cash.toFixed(2)} ${suffixes[i]}`;
    }
});