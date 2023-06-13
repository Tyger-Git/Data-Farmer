// Imports


// Wrap the code in a DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', (event) => {


    // Initialize the game state
    let gameState = {
        bytes: 0,
        cash: 0,
        cashOutMulti: .0015,
        dFarmers: 0,
        dFarmerSpeedLevel: 1,
        dFarmerUpgradeLevel: 1,
        dFarmerTickIncrement: 1000,
        level: 1,
        exp: 0
    };
    // Early Initializations
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    let maxCashOut = formatCash(gameState.bytes * gameState.cashOutMulti);
    let autoGenPerSec = gameState.dFarmers / (gameState.dFarmerTickIncrement / 1000); // Per sec calc
    let nextLevelReqExp = ((gameState.level * 100) * (gameState.level ** 3));
    let prevLevelReqExp = 0;
    let currentLevelExp = gameState.exp - prevLevelReqExp;
    let currentLevelReqExp = nextLevelReqExp - prevLevelReqExp;
    let progressPercentage = (currentLevelExp / currentLevelReqExp) * 100; // Calc Progress Percentage
    let dFarmerSpeedNextUpgradeCost = (gameState.dFarmerSpeedLevel ** 2) * 10;
    let dFarmerSpeedNextUpgradeAmnt = (1000 / (gameState.dFarmerSpeedLevel + 1)) / 1000;
    let dFarmerLevelNextUpgradeCost = (gameState.dFarmerUpgradeLevel ** 2) * 10;;
    let dFarmerLevelNextUpgradeAmnt = (gameState.dFarmerUpgradeLevel + 1) ** 3;

    // Initial Function Calls
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    updateTextElements();
    updateUpgradeTextElements();
    areUpgradesAvailable();

    // Clock
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    setInterval(function () {
        gameState.bytes += (gameState.dFarmers * (gameState.dFarmerUpgradeLevel ** 3));
        gameState.exp += (gameState.dFarmers * (gameState.dFarmerUpgradeLevel ** 3));
        levelUpCheck();
        updateTextElements();

        //Check if upgrades are available
        areUpgradesAvailable(gameState.cash);
    }, gameState.dFarmerTickIncrement);

    // Buttons
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    // Upgrade Panel Button
    let upgradesPanel = document.getElementById('upgradesPanel');
    let toggleUpgradesPanelBtn = document.getElementById('toggleUpgradesPanelBtn');

    toggleUpgradesPanelBtn.addEventListener('click', function () {
        if (upgradesPanel.style.right === "0px") {
            upgradesPanel.style.right = "-500px";
            toggleUpgradesPanelBtn.style.right = "0px";
        } else {
            upgradesPanel.style.right = "0px";
            toggleUpgradesPanelBtn.style.right = "500px";
        }
    });
    // Collect Button
    document.getElementById('collect-btn').addEventListener('click', function () {
        gameState.bytes++;
        gameState.exp++;
        levelUpCheck();
        updateTextElements();
    });

    // Cash Out Button
    document.getElementById('cashout-btn').addEventListener('click', function () {
        let cashToAdd = (gameState.bytes * gameState.cashOutMulti);
        gameState.cash = gameState.cash + cashToAdd;
        gameState.bytes = 0;
        updateTextElements();
    });

    // Upgrade dFarmer Speed
    document.getElementById('dFarmerSpeedUpgrade-btn').addEventListener('click', function () {
        if (gameState.dFarmerSpeedLevel < 9) {
            gameState.cash -= dFarmerSpeedNextUpgradeCost;
            gameState.dFarmerSpeedLevel++;
            gameState.dFarmerTickIncrement = 1000 / gameState.dFarmerSpeedLevel;
            dFarmerSpeedNextUpgradeAmnt = (1000 / (gameState.dFarmerSpeedLevel + 1)) / 1000;
            updateTextElements();
            updateUpgradeTextElements();
            areUpgradesAvailable();
        } else {
            gameState.cash -= dFarmerSpeedNextUpgradeCost;
            gameState.dFarmerSpeedLevel++;
            gameState.dFarmerTickIncrement = 1000 / gameState.dFarmerSpeedLevel;
            dFarmerSpeedNextUpgradeAmnt = 0;
            updateTextElements();
            updateUpgradeTextElements();
            areUpgradesAvailable();
            //Turn button off if max level
            this.disabled = true;
        }
    });
    // Upgrade dFarmer Level
    document.getElementById('dFarmerLevelUpgrade-btn').addEventListener('click', function () {
        if (gameState.dFarmerUpgradeLevel < 9) {
            gameState.cash -= dFarmerLevelNextUpgradeCost;
            gameState.dFarmerUpgradeLevel++;
            dFarmerLevelNextUpgradeAmnt = (gameState.dFarmerUpgradeLevel + 1) ** 3;
            updateTextElements();
            updateUpgradeTextElements();
            areUpgradesAvailable();
            console.log("a");
        } else {
            gameState.cash -= dFarmerLevelNextUpgradeCost;
            gameState.dFarmerUpgradeLevel++;
            updateTextElements();
            updateUpgradeTextElements();
            areUpgradesAvailable();
            //Turn button off if max level
            this.disabled = true;
            console.log("b");
        }
    });

    // Data Farmers
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    document.getElementById('buyDFarmer1-btn').addEventListener('click', function () {
        gameState.dFarmers++;
        autoGenPerSec = gameState.dFarmers / (gameState.dFarmerTickIncrement / 1000); // ReCalc Auto Gen
        updateTextElements();
    });
    document.getElementById('buyDFarmer10-btn').addEventListener('click', function () {
        gameState.dFarmers += 10;
        autoGenPerSec = gameState.dFarmers / (gameState.dFarmerTickIncrement / 1000); //ReCalc Auto Gen
        updateTextElements();
    });
    document.getElementById('buyDFarmer100-btn').addEventListener('click', function () {
        gameState.dFarmers += 100;
        autoGenPerSec = gameState.dFarmers / (gameState.dFarmerTickIncrement / 1000); //ReCalc Auto Gen
        updateTextElements();
    });

    //Upgrade Functions
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    function areUpgradesAvailable(cash) {
        if (gameState.dFarmers > 0) {
            if (cash >= dFarmerSpeedNextUpgradeCost) { document.getElementById('dFarmerSpeedUpgrade-btn').disabled = false; } else { document.getElementById('dFarmerSpeedUpgrade-btn').disabled = true; } // dFarmer Speed Upgrade
            if (cash >= dFarmerLevelNextUpgradeCost) { document.getElementById('dFarmerSpeedUpgrade-btn').disabled = false; } else { document.getElementById('dFarmerSpeedUpgrade-btn').disabled = true; } // dFarmer Level Upgrade
        }
        else {
            document.getElementById('dFarmerSpeedUpgrade-btn').disabled = true;
            document.getElementById('dFarmerLevelUpgrade-btn').disabled = true;
        }
    }

    // Updating Functions
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    function updateProgressBar() {
        progressPercentage = (currentLevelExp / currentLevelReqExp) * 100; // ReCalc Progress Percentage
        document.getElementById('expBar').style.width = progressPercentage + "%"; // Update Exp Bar
        document.getElementById('expBar').setAttribute('aria-valuenow', progressPercentage); // Update Exp Bar
    }

    function updateTextElements() {
        document.getElementById('levelText').innerText = `${gameState.level}`; // Update Level Text
        document.getElementById('expCounter').innerText = formatExp(gameState.exp, nextLevelReqExp); // Update Exp Text
        document.getElementById('bCounter').innerText = formatBytes(gameState.bytes);  // Update the counter display
        maxCashOut = formatCash(gameState.bytes * gameState.cashOutMulti); // ReCalc Cash Out Value
        document.getElementById("cashOutVal").innerText = maxCashOut;   // Update the Cash Out Value
        document.getElementById('cashCounter').innerText = formatCash(gameState.cash);  // Update the Total Cash display
        document.getElementById('autoGenText').innerText = formatBytes(autoGenPerSec);    // Update Auto Gen Text
        document.getElementById('dFarmerTotal').innerText = formatAddSuff(gameState.dFarmers); // Update Data Farmer Total
    }

    function updateUpgradeTextElements() {
        document.getElementById('dFarmerSpeedLevelText').innerText = `Data Farmer Speed Level : ${gameState.dFarmerSpeedLevel} / 10`; // Update Data Farmer Speed Level
        document.getElementById('dFarmerUpgradeLevelText').innerText = `Data Farmer Upgrade Level : ${gameState.dFarmerUpgradeLevel} / 10`; // Update Data Farmer Upgrade Level
        if (gameState.dFarmerSpeedLevel < 10) {
            document.getElementById('dFarmerSpeedUpgrade-btn').innerText = `Increase Speed : ${dFarmerSpeedNextUpgradeAmnt} sec tick rate | Cost : ${formatCash(dFarmerSpeedNextUpgradeCost)}`; // Update Data Farmer Speed Upgrade Cost
        } else {
            document.getElementById('dFarmerSpeedUpgrade-btn').innerText = `Max Speed`; // Update Data Farmer Speed Upgrade Cost
        }
        document.getElementById('dFarmerLevelUpgrade-btn').innerText = `Bytes per tick : +${formatBytes(dFarmerLevelNextUpgradeAmnt)} Cost : ${formatCash(dFarmerLevelNextUpgradeCost)}`; // Update Data Farmer Level Upgrade Cost
    }


    // Leveling
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    function levelUpCheck() {
        // Update variables
        currentLevelExp = gameState.exp - prevLevelReqExp;
        currentLevelReqExp = nextLevelReqExp - prevLevelReqExp;

        updateProgressBar();

        if (gameState.exp >= nextLevelReqExp) {
            gameState.level++;
            prevLevelReqExp = nextLevelReqExp; // Set Previous Level Req Exp
            nextLevelReqExp = ((gameState.level * 100) * (gameState.level ** 2)); // ReCalc Next Level Req Exp
            updateProgressBar();
            updateTextElements();
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

    function formatAddSuff(num) {
        let i = 0;
        const suffixes = ['M', 'B', 'T'];
        while (num >= 1000000000 && i < suffixes.length) {
            num /= 1000;
            i++;
        }
        if (num < 1000000) {
            return num.toLocaleString('en-US');
        } else {
            return `${num.toFixed(2)} ${suffixes[i]}`;
        }
    }
});