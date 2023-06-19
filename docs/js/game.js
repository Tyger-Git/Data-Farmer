// Imports

// Testing
// Testing Git Hook

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
    let gamePaused = false;
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

    
    // Clock
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    var gameClock;
    function setGameClock() {
        // Clear existing clock if any
        if (gameClock) {
            clearInterval(gameClock);
        }

        // Create new game clock
        gameClock = setInterval(function () {
            if (!gamePaused) {
                gameState.bytes += (gameState.dFarmers * (gameState.dFarmerUpgradeLevel ** 3));
                gameState.exp += (gameState.dFarmers * (gameState.dFarmerUpgradeLevel ** 3));
                updateAll();
            }
        }, gameState.dFarmerTickIncrement);
    }

    // Global Update Function
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    function updateAll() {
        levelUpCheck();
        updateTextElements();
        areUpgradesAvailable(gameState.cash);
        updateUpgradeTextElements();
    }

    // Initial Function Calls
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    updateAll();
    setGameClock();

    // Hide Level Elements
    /* -------------------------------------------------------------------------------------------------------------------------------- */

    //Disabled for testing

    document.getElementById('dFarmers').style.display = "none";
    document.getElementById('toggleUpgradesPanelBtn').style.display = "none"
    activateNewLevelElements();
    

    // Initial elements to disable
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    document.getElementById('dFarmerSpeedUpgrade-btn').disabled = true;
    document.getElementById('dFarmerLevelUpgrade-btn').disabled = true;

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
        //gameState.bytes++; Testing Purposes
        gameState.bytes += 10;
        //gameState.exp++; Testing Purposes
        gameState.exp += 10;
        updateAll();
    });

    // Cash Out Button
    document.getElementById('cashout-btn').addEventListener('click', function () {
        let cashToAdd = (gameState.bytes * gameState.cashOutMulti);
        gameState.cash = gameState.cash + cashToAdd;
        gameState.bytes = 0;
        updateAll();
    });

    // Upgrade dFarmer Speed
    document.getElementById('dFarmerSpeedUpgrade-btn').addEventListener('click', function () {
        if (gameState.dFarmerSpeedLevel < 9) {
            gameState.cash -= dFarmerSpeedNextUpgradeCost;
            gameState.dFarmerSpeedLevel++;
            gameState.dFarmerTickIncrement = 1000 / gameState.dFarmerSpeedLevel;
            dFarmerSpeedNextUpgradeAmnt = (1000 / (gameState.dFarmerSpeedLevel + 1)) / 1000;
            updateAll();
            setGameClock();
        } else {
            gameState.cash -= dFarmerSpeedNextUpgradeCost;
            gameState.dFarmerSpeedLevel++;
            gameState.dFarmerTickIncrement = 1000 / gameState.dFarmerSpeedLevel;
            dFarmerSpeedNextUpgradeAmnt = 0;
            updateAll();
            setGameClock();
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
            updateAll();
        } else {
            gameState.cash -= dFarmerLevelNextUpgradeCost;
            gameState.dFarmerUpgradeLevel++;
            updateAll();
            //Turn button off if max level
            this.disabled = true;
        }
    });

    // Data Farmers
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    document.getElementById('buyDFarmer1-btn').addEventListener('click', function () {
        gameState.dFarmers++;
        autoGenPerSec = gameState.dFarmers / (gameState.dFarmerTickIncrement / 1000); // ReCalc Auto Gen
        updateAll();
    });
    document.getElementById('buyDFarmer10-btn').addEventListener('click', function () {
        gameState.dFarmers += 10;
        autoGenPerSec = gameState.dFarmers / (gameState.dFarmerTickIncrement / 1000); //ReCalc Auto Gen
        updateAll();
    });
    document.getElementById('buyDFarmer100-btn').addEventListener('click', function () {
        gameState.dFarmers += 100;
        autoGenPerSec = gameState.dFarmers / (gameState.dFarmerTickIncrement / 1000); //ReCalc Auto Gen
        updateAll();
    });

    //Upgrade Functions
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    function areUpgradesAvailable(cash) {
        if (gameState.dFarmers > 0) {
            if (cash >= dFarmerSpeedNextUpgradeCost) { document.getElementById('dFarmerSpeedUpgrade-btn').disabled = false; } else { document.getElementById('dFarmerSpeedUpgrade-btn').disabled = true; } // dFarmer Speed Upgrade
            if (cash >= dFarmerLevelNextUpgradeCost) { document.getElementById('dFarmerLevelUpgrade-btn').disabled = false; } else { document.getElementById('dFarmerLevelUpgrade-btn').disabled = true; } // dFarmer Level Upgrade
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

        //DFarmer Upgrade Text
        document.getElementById('dFarmerSpeedLevelText').innerText = `Data Farmer Speed Level : ${gameState.dFarmerSpeedLevel} / 10`; // Update Data Farmer Speed Level
        document.getElementById('dFarmerUpgradeLevelText').innerText = `Data Farmer Upgrade Level : ${gameState.dFarmerUpgradeLevel} / 10`; // Update Data Farmer Upgrade Level
        if (gameState.dFarmerSpeedLevel < 10 && gameState.dFarmers > 0) {
            document.getElementById('dFarmerSpeedUpgrade-btn').innerText = `Increase Speed : ${dFarmerSpeedNextUpgradeAmnt} sec tick rate | Cost : ${formatCash(dFarmerSpeedNextUpgradeCost)}`; // Update Data Farmer Speed Upgrade Cost
        } else if (gameState.dFarmerSpeedLevel === 10 && gameState.dFarmers > 0) {
            document.getElementById('dFarmerSpeedUpgrade-btn').innerText = `Max Speed`; // Maxxed Out
        } else {
            document.getElementById('dFarmerSpeedUpgrade-btn').innerText = `Buy Data Farmers to Enable Upgrades!`; // No dFarmer Case
        }
        if (gameState.dFarmerUpgradeLevel < 10 && gameState.dFarmers > 0) {
            document.getElementById('dFarmerLevelUpgrade-btn').innerText = `Bytes per tick : +${formatBytes(dFarmerLevelNextUpgradeAmnt)} Cost : ${formatCash(dFarmerLevelNextUpgradeCost)}`; // Update Data Farmer Level Upgrade Cost
        } else if (gameState.dFarmerSpeedLevel === 10 && gameState.dFarmers > 0) {
            document.getElementById('dFarmerLevelUpgrade-btn').innerText = `Max Bytes Per Tick`; // Maxxed out
        } else {
            document.getElementById('dFarmerLevelUpgrade-btn').innerText = `Buy Data Farmers to Enable Upgrades!`; // No dFarmer Case
        }


    }

    // Save Game and Pause Game
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    function saveGame() {

    }

    function pauseGame() {
        gamePaused = true;
        saveGame();
    }

    function unPauseGame() {
        gamePaused = false;
        saveGame();
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
            activateNewLevelElements();
            levelUpModal(gameState.level);
        }
    }

    function activateNewLevelElements() {
        switch (gameState.level) {
            case 2:
                document.getElementById('dFarmers').style.display = "flex";
                break;
            case 3:
                document.getElementById('toggleUpgradesPanelBtn').style.display = "block";
                break;
        }
    }

    var levelUpMsg = [
        "You've unlocked Freelance Data Farmers! For an upfront cost, you can now hire freelance data miners to help gather data from the web. These freelance workers will automatically produce data over time. Outsourcing baby!",
        "You've unlocked the Upgrades panel! Here you can purchase upgrades for all sorts of things. Check out the tab to the right!",
        "4",
        "5"
    ];

    function levelUpModal(level) {
        pauseGame();
        document.getElementById('levelUpModalHeader').textContent = `Congratulations, you've reached level ${level}!`;
        document.getElementById('levelUpModalText').textContent = levelUpMsg[level - 2];
        document.getElementById('levelUpModal').style.display = "block";
    }

    var modal = document.getElementById("levelUpModal");
    var btn = document.getElementById("gotItBtn");

    btn.onclick = function () {
        modal.style.display = "none";
        unPauseGame();
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            unPauseGame();
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